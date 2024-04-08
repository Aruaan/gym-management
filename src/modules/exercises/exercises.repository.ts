import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { Exercise } from '../../database/entities/Exercise.entity'
import { Injectable } from '@nestjs/common'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { calculateOffset } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { exerciseAlias } from '../../database/databaseUtil/aliases'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

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
  ): Promise<PaginatedResultDto<Exercise>> {
    const { limit, page, workoutId } = paginationWithFilter
    const offset = calculateOffset(limit, page)

    let queryBuilder = this.createQueryBuilder(exerciseAlias).skip(offset).limit(limit)
    if (workoutId) {
      queryBuilder = queryBuilder.where('exercise.workout_id = :workoutId', { workoutId })
    }
    const [exercises, count] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(count / limit)
    return { data: exercises, limit, page, count, totalPages }
  }

  async findById(id: string): Promise<Exercise> {
    return this.findOneBy({ id })
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<UpdateResult> {
    return this.update(id, updateExerciseDto)
  }

  async deleteExercise(id: string): Promise<DeleteResult> {
    return this.delete(id)
  }
}
