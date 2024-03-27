import { DataSource, Repository } from 'typeorm'
import { Exercise } from '../../database/entities/Exercise.entity'
import { PaginationRequestDto } from 'src/modules/members/dto/pagination-request.dto'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PaginatedExerciseResult } from './dto/paginated-exercise.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import {
  calculateOffset,
  errorMessages,
} from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { CreateExerciseDto } from './dto/create-exercise.dto'

@Injectable()
export class ExerciseRepository extends Repository<Exercise> {
  constructor(private dataSource: DataSource) {
    super(Exercise, dataSource.createEntityManager())
  }

  async createAndSave(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const newExercise = this.create(createExerciseDto)
    return await this.save(newExercise)
  }

  async findAllExercises(
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedExerciseResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const [exercises, total] = await this.findAndCount({ skip: offset, take: limit })
    const totalPages = Math.ceil(total / limit)
    return { data: exercises, limit, offset, total, totalPages }
  }

  async findAllByWorkoutIdOrThrow(
    workoutId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedExerciseResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const [exercises, total] = await this.findAndCount({
      where: { workoutId },
      skip: offset,
      take: limit,
    })
    const totalPages = Math.ceil(total / limit)
    return { data: exercises, limit, offset, total, totalPages }
  }

  async findByIdOrThrow(id: string): Promise<Exercise> {
    const exercise = await this.findOne({
      where: { id: id },
    })
    if (!exercise) throw new NotFoundException(errorMessages.generateEntityNotFound('Exercise'))
    return exercise
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findByIdOrThrow(id)
    const updated = Object.assign(exercise, updateExerciseDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('exercise'))
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Exercise'))
    }
  }
}
