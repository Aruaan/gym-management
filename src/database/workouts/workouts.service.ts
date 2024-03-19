import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkoutRepository } from './workouts.repository'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { PaginatedWorkoutResult } from './dto/paginated-workout.dto'
import { Workout } from '../entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'

@Injectable()
export class WorkoutService {
  constructor(@InjectRepository(WorkoutRepository) private workoutRepository: WorkoutRepository) {}

  async findAllWorkouts(paginationRequest: PaginationRequestDto): Promise<PaginatedWorkoutResult> {
    const { limit, offset } = paginationRequest
    const [workouts, total] = await this.workoutRepository.findAndCount({
      skip: offset,
      take: limit,
    })
    const totalPages = Math.ceil(total / limit)
    return { data: workouts, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findById(id)
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`)
    }
    return workout
  }

  async findAllByMemberId(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedWorkoutResult> {
    const { limit, offset } = paginationRequest
    const [workouts, total] = await this.workoutRepository.findAllByMemberId(
      memberId,
      paginationRequest
    )
    const totalPages = Math.ceil(total / limit)
    return { data: workouts, limit, offset, total, totalPages }
  }

  async addWorkout(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    try {
      const newWorkout = this.workoutRepository.create(createWorkoutDto)
      return await this.workoutRepository.save(newWorkout)
    } catch (error) {
      throw new InternalServerErrorException('Error adding workout')
    }
  }

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    const allowedUpdateFields = ['memberId', 'type', 'notes']
    Object.keys(updateWorkoutDto).forEach((key) => {
      if (!allowedUpdateFields.includes(key)) {
        throw new BadRequestException(`Invalid field name ${key}`)
      }
    })
    return await this.workoutRepository.updateWorkout(id, updateWorkoutDto)
  }

  async deleteWorkout(id: string): Promise<void> {
    return await this.workoutRepository.deleteWorkout(id)
  }
}
