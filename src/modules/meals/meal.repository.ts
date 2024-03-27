import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Meal } from '../../database/entities/Meal.entity'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { DataSource, Repository } from 'typeorm'
import { CreateMealDto } from './dto/create-meal.dto'
import {
  calculateOffset,
  errorMessages,
} from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { UpdateMealDto } from './dto/update-meal.dto'

@Injectable()
export class MealRepository extends Repository<Meal> {
  constructor(private dataSource: DataSource) {
    super(Meal, dataSource.createEntityManager())
  }

  async createAndSave(createMealDto: CreateMealDto): Promise<Meal> {
    const newMeal = this.create(createMealDto)
    return await this.save(newMeal)
  }

  async findAll(options: { skip: number; take: number }): Promise<[Meal[], number]> {
    const [meals, total] = await Promise.all([this.find(options), this.count()])

    return [meals, total]
  }

  async findByIdOrThrow(id: string): Promise<Meal> {
    const meal = await this.findOne({
      where: { id: id },
    })
    if (!meal) throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
    return meal
  }

  async findAllByMemberIdOrThrow(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<[Meal[], number]> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const query = this.createQueryBuilder('meal')
      .where('meal.memberId = :memberId', { memberId })
      .skip(offset)
      .take(limit)
    const [meals, total] = await query.getManyAndCount()
    return [meals, total]
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findByIdOrThrow(id)
    const updated = Object.assign(meal, updateMealDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('meal'))
    }
  }

  async deleteMeal(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
    }
  }
}
