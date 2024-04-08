import { Injectable } from '@nestjs/common'
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { Workout } from '../../database/entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { workoutAlias } from '../../database/databaseUtil/aliases'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class WorkoutRepository extends Repository<Workout> {
  constructor(private dataSource: DataSource) {
    super(Workout, dataSource.createEntityManager())
  }

  async createAndSave(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const newWorkout = this.create(createWorkoutDto)
    return await this.save(newWorkout)
  }

  async findAllWorkoutsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Workout>> {
    const { limit, page, memberId } = paginationWithFilter
    const offset = calculateOffset(limit, page)

    let queryBuilder = this.createQueryBuilder(workoutAlias).skip(offset).limit(limit)

    if (memberId) {
      queryBuilder = queryBuilder.where('workout.member_id = :memberId', { memberId })
    }

    const [workouts, count] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(count / limit)
    return { data: workouts, limit, page, count, totalPages }
  }

  async findById(id: string): Promise<Workout> {
    return this.findOneBy({ id })
  }

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<UpdateResult> {
    return this.update(id, updateWorkoutDto)
  }

  async deleteWorkout(id: string): Promise<DeleteResult> {
    return this.delete(id)
  }
}
