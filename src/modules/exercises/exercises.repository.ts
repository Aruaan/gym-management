import { DataSource, Repository } from 'typeorm'
import { Exercise } from '../../database/entities/Exercise.entity'
import { Injectable } from '@nestjs/common'
import { PaginatedExerciseResult } from './dto/paginated-exercise.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { calculateOffset } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
import { exerciseAlias } from '../../database/databaseUtil/aliases'

@Injectable()
export class ExerciseRepository extends Repository<Exercise> {
  constructor(private dataSource: DataSource) {
    super(Exercise, dataSource.createEntityManager())
  }

  async createAndSave(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const newExercise = this.create(createExerciseDto)
    return await this.save(newExercise)
  }

  async findAllExercisesWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedExerciseResult> {
    const { limit, page, workoutId } = paginationWithFilter
    const offset = calculateOffset(limit, page)
    let queryBuilder = this.createQueryBuilder(exerciseAlias).skip(offset).limit(limit)
    if (workoutId) {
      queryBuilder = queryBuilder.where('exercise.workout_id = :workoutId', { workoutId })
    }
    const [exercises, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / limit)
    return { data: exercises, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Exercise> {
    return await this.findOneBy({ id })
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findById(id)
    const updated = Object.assign(exercise, updateExerciseDto)

    await this.save(updated)
    return updated
  }

  async deleteExercise(id: string): Promise<void> {
    await this.delete(id)
  }
}
