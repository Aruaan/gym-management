import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Workout } from '../../database/entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
import { PaginatedWorkoutResult } from './dto/paginated-workout.dto'
import { workoutAlias } from '../../database/databaseUtil/aliases'

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
  ): Promise<PaginatedWorkoutResult> {
    const { limit, page, memberId } = paginationWithFilter
    const offset = calculateOffset(limit, page)
    let queryBuilder = this.createQueryBuilder(workoutAlias).skip(offset).limit(limit)
    if (memberId) {
      queryBuilder = queryBuilder.where('workout.member_id = :memberId', { memberId })
    }
    const [workouts, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / limit)
    return { data: workouts, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Workout> {
    return await this.findOneBy({ id })
  }

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    const workout = await this.findById(id)
    const updated = Object.assign(workout, updateWorkoutDto)

    await this.save(updated)
    return updated
  }

  async deleteWorkout(id: string): Promise<void> {
    await this.delete(id)
  }
}
