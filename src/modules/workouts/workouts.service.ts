import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkoutRepository } from './workouts.repository'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { PaginatedWorkoutResult } from './dto/paginated-workout.dto'
import { Workout } from '../../database/entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { calculateOffset } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'

@Injectable()
export class WorkoutService {
  constructor(@InjectRepository(WorkoutRepository) private workoutRepository: WorkoutRepository) {}

  async findAllWorkouts(paginationRequest: PaginationRequestDto): Promise<PaginatedWorkoutResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)
    const [workouts, total] = await this.workoutRepository.findAndCount({
      skip: offset,
      take: limit,
    })
    const totalPages = Math.ceil(total / limit)
    return { data: workouts, limit, offset, total, totalPages }
  }

  async findByIdOrThrow(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findByIdOrThrow(id)
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`)
    }
    return workout
  }

  async findAllByMemberId(
    paginationRequest: PaginationRequestDto,
    memberId: string
  ): Promise<PaginatedWorkoutResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const [workouts, total] = await this.workoutRepository.findAllByMemberId(
      paginationRequest,
      memberId
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
    return await this.workoutRepository.updateWorkout(id, updateWorkoutDto)
  }

  async deleteWorkout(id: string): Promise<void> {
    return await this.workoutRepository.deleteWorkout(id)
  }
}
