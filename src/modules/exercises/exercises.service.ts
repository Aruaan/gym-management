import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExerciseRepository } from './exercises.repository'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { Exercise } from '../../database/entities/Exercise.entity'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async findAllExercisesWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Exercise>> {
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

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<void> {
    try {
      const updateResult = await this.exerciseRepository.updateExercise(id, updateExerciseDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Exercise'))
      }
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('exercise'))
    }
  }

  async deleteExercise(id: string): Promise<void> {
    try {
      const deleteResult = await this.exerciseRepository.deleteExercise(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Exercise'))
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateDeleteFailed('exercise'))
    }
  }
}
