import { Injectable } from '@nestjs/common'
import { Meal } from '../../database/entities/Meal.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedMealResult } from './dto/paginated-meal.dto'
import { mealAlias } from '../../database/databaseUtil/aliases'

@Injectable()
export class MealRepository extends Repository<Meal> {
  constructor(private dataSource: DataSource) {
    super(Meal, dataSource.createEntityManager())
  }

  async createAndSave(createMealDto: CreateMealDto): Promise<Meal> {
    const newMeal = this.create(createMealDto)
    return await this.save(newMeal)
  }

  async findAllMealsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedMealResult> {
    const { limit, page, memberId } = paginationWithFilter
    const offset = calculateOffset(limit, page)

    let queryBuilder = this.createQueryBuilder(mealAlias).skip(offset).limit(limit)
    if (memberId) {
      queryBuilder = queryBuilder.where('meal.member_id = :memberId', { memberId })
    }

    const [meals, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / limit)
    return { data: meals, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Meal> {
    return await this.findOneBy({ id })
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findById(id)
    const updated = Object.assign(meal, updateMealDto)

    await this.save(updated)
    return updated
  }

  async deleteMeal(id: string): Promise<void> {
    await this.delete(id)
  }
}
