import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Workout } from '../../database/entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import {
  calculateOffset,
  errorMessages,
} from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { UpdateWorkoutDto } from './dto/update-workout.dto'

@Injectable()
export class WorkoutRepository extends Repository<Workout> {
  constructor(private dataSource: DataSource) {
    super(Workout, dataSource.createEntityManager())
  }

  async createAndSave(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const newWorkout = this.create(createWorkoutDto)
    return await this.save(newWorkout)
  }

  async findAllWorkouts(paginationRequest: PaginationRequestDto): Promise<[Workout[], number]> {
    const { limit, page } = paginationRequest
    const queryBuilder = this.createQueryBuilder('workout')
    const offset = calculateOffset(limit, page)

    try {
      const [workouts, total] = await queryBuilder.skip(offset).take(limit).getManyAndCount()
      return [workouts, total]
    } catch (error) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Workouts'))
    }
  }

  async findByIdOrThrow(id: string): Promise<Workout> {
    const workout = await this.findOne({
      where: { id: id },
    })
    if (!workout) throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
    return workout
  }

  async findAllByMemberId(
    paginationRequest: PaginationRequestDto,
    memberId: string
  ): Promise<[Workout[], number]> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)
    const query = this.createQueryBuilder('workout')
      .where('workout.memberId = :memberId', { memberId })
      .skip(offset)
      .take(limit)
    const [workouts, total] = await query.getManyAndCount()
    return [workouts, total]
  }

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    const workout = await this.findByIdOrThrow(id)
    const updated = Object.assign(workout, updateWorkoutDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('workout'))
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
    }
  }
}
