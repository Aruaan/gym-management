import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExerciseRepository } from './exercises.repository'
import { PaginatedExerciseResult } from './dto/paginated-exercise.dto'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { Exercise } from '../../database/entities/Exercise.entity'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async findAllExercisesWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedExerciseResult> {
    try {
      return this.exerciseRepository.findAllExercisesWithFilter({
        limit: paginationWithFilter.limit,
        page: paginationWithFilter.page,
        workoutId: paginationWithFilter.workoutId || null,
      })
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('exercises'))
    }
  }

  async findByIdOrThrow(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findById(id)
    if (!exercise) {
      throw new InternalServerErrorException(errorMessages.generateEntityNotFound('Exercise'))
    }
    return exercise
  }

  async addExercise(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    try {
      return this.exerciseRepository.createAndSave(createExerciseDto)
    } catch (err) {
      throw new InternalServerErrorException('Error adding exercise.')
    }
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    try {
      return await this.exerciseRepository.updateExercise(id, updateExerciseDto)
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('equipment'))
    }
  }

  async deleteExercise(id: string): Promise<void> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Exercise'))

    return await this.exerciseRepository.deleteExercise(id)
  }
}
