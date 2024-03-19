import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Meal } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Meal.entity'
import { PaginationRequestDto } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/members/dto/pagination-request.dto'
import { DataSource, Repository } from 'typeorm'
import { CreateMealDto } from './dto/create-meal.dto'
import { errorMessages } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
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

  async findAllMeals(paginationRequest: PaginationRequestDto): Promise<[Meal[], number]> {
    const { limit, offset } = paginationRequest
    const queryBuilder = this.createQueryBuilder('meal')

    try {
      const [meals, total] = await queryBuilder.skip(offset).take(limit).getManyAndCount()
      return [meals, total]
    } catch (error) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Meals'))
    }
  }

  async findById(id: string): Promise<Meal> {
    const meal = await this.findOne({
      where: { id: id },
    })
    if (!meal) throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
    return meal
  }

  async findAllByMemberId(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<[Meal[], number]> {
    const { limit, offset } = paginationRequest
    const query = this.createQueryBuilder('meal')
      .where('meal.memberId = :memberId', { memberId })
      .skip(offset)
      .take(limit)
    const [meals, total] = await query.getManyAndCount()
    return [meals, total]
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findById(id)
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
