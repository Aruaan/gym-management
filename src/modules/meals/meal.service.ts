import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MealRepository } from './meal.repository'
import { Meal } from '../../database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { DataSource } from 'typeorm'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class MealService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MealRepository)
    private readonly mealRepository: MealRepository
  ) {}

  async findAllMealsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Meal>> {
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

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<void> {
    try {
      const updateResult = await this.mealRepository.updateMeal(id, updateMealDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
      }
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('meal'))
    }
  }

  async deleteMeal(id: string): Promise<void> {
    try {
      const deleteResult = await this.mealRepository.deleteMeal(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Meal'))
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateDeleteFailed('meal'))
    }
  }
}
