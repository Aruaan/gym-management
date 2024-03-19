import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Workout } from '../entities/Workout.entity'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { errorMessages } from '../databaseUtil/utilFunctions'
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
    const { limit, offset } = paginationRequest
    const queryBuilder = this.createQueryBuilder('workout')

    try {
      const [workouts, total] = await queryBuilder.skip(offset).take(limit).getManyAndCount()
      return [workouts, total]
    } catch (error) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Workouts'))
    }
  }

  async findById(id: string): Promise<Workout> {
    const workout = await this.findOne({
      where: { id: id },
    })
    if (!workout) throw new NotFoundException(errorMessages.generateEntityNotFound('Workout'))
    return workout
  }

  async findAllByMemberId(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<[Workout[], number]> {
    const { limit, offset } = paginationRequest
    const query = this.createQueryBuilder('workout')
      .where('workout.memberId = :memberId', { memberId })
      .skip(offset)
      .take(limit)
    const [workouts, total] = await query.getManyAndCount()
    return [workouts, total]
  }

  async updateWorkout(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    const workout = await this.findById(id)
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
