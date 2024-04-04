import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkoutRepository } from './workouts.repository'
import { PaginatedWorkoutResult } from './dto/paginated-workout.dto'
import { Workout } from '../../database/entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'

@Injectable()
export class WorkoutService {
  constructor(@InjectRepository(WorkoutRepository) private workoutRepository: WorkoutRepository) {}

  async findAllWorkoutsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedWorkoutResult> {
    try {
      return this.workoutRepository.findAllWorkoutsWithFilter({
        limit: paginationWithFilter.limit,
        page: paginationWithFilter.page,
        memberId: paginationWithFilter.memberId || null,
      })
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('workouts'))
    }
  }

  async findByIdOrThrow(id: string): Promise<Workout> {
    const workout = await this.workoutRepository.findById(id)
    if (!workout) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
    }
    return workout
  }

  async addWorkout(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    try {
      return this.workoutRepository.createAndSave(createWorkoutDto)
    } catch (err) {
      throw new InternalServerErrorException('Error adding workout.')
    }
  }

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))

    try {
      return await this.workoutRepository.updateWorkout(id, updateWorkoutDto)
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('workout'))
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
    return await this.workoutRepository.deleteWorkout(id)
  }
}
