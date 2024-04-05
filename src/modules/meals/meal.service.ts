import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MealRepository } from './meal.repository'
import { PaginatedMealResult } from './dto/paginated-meal.dto'
import { Meal } from '../../database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { DataSource } from 'typeorm'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'

@Injectable()
export class MealService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MealRepository)
    private readonly mealRepository: MealRepository
  ) {}

  async findAllMealsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedMealResult> {
    try {
      return this.mealRepository.findAllMealsWithFilter({
        limit: paginationWithFilter.limit,
        page: paginationWithFilter.page,
        memberId: paginationWithFilter.memberId || null,
      })
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('meals'))
    }
  }

  async findByIdOrThrow(id: string): Promise<Meal> {
    const meal = await this.mealRepository.findById(id)
    if (!meal) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
    }
    return meal
  }

  async addMeal(createMealDto: CreateMealDto): Promise<Meal> {
    try {
      return this.mealRepository.createAndSave(createMealDto)
    } catch (err) {
      throw new InternalServerErrorException('Error adding meal.')
    }
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
    try {
      return await this.mealRepository.updateMeal(id, updateMealDto)
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('meal'))
    }
  }

  async deleteMeal(id: string): Promise<void> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
    return await this.mealRepository.deleteMeal(id)
  }
}
