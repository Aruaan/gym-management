import { Injectable } from '@nestjs/common'
import { Meal } from '../../database/entities/Meal.entity'
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { mealAlias } from '../../database/databaseUtil/aliases'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

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
  ): Promise<PaginatedResultDto<Meal>> {
    const { limit, page, memberId } = paginationWithFilter
    const offset = calculateOffset(limit, page)

    let queryBuilder = this.createQueryBuilder(mealAlias).skip(offset).limit(limit)
    if (memberId) {
      queryBuilder = queryBuilder.where('meal.member_id = :memberId', { memberId })
    }

    const [meals, count] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(count / limit)
    return { data: meals, limit, page, count, totalPages }
  }

  async findById(id: string): Promise<Meal> {
    return await this.findOneBy({ id })
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<UpdateResult> {
    return await this.update(id, updateMealDto)
  }

  async deleteMeal(id: string): Promise<DeleteResult> {
    return await this.delete(id)
  }
}
