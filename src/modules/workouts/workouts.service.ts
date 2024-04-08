import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorkoutRepository } from './workouts.repository'
import { Workout } from '../../database/entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class WorkoutService {
  constructor(@InjectRepository(WorkoutRepository) private workoutRepository: WorkoutRepository) {}

  async findAllWorkoutsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Workout>> {
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

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<void> {
    try {
      const updateResult = await this.workoutRepository.updateWorkout(id, updateWorkoutDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
      }
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('workout'))
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    try {
      const deleteResult = await this.workoutRepository.deleteWorkout(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateDeleteFailed('workout'))
    }
  }
}
