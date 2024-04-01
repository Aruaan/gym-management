import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MealRepository } from './meal.repository'
import { PaginationRequestDto } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/members/dto/pagination-request.dto'
import { PaginatedMealResult } from './dto/paginated-meal.dto'
import { Meal } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { errorMessages } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(MealRepository)
    private readonly mealRepository: MealRepository
  ) {}

  async findAllMeals(paginationRequestDto: PaginationRequestDto): Promise<PaginatedMealResult> {
    try {
      const { limit, offset } = paginationRequestDto
      const [meals, total] = await this.mealRepository.findAllMeals(paginationRequestDto)
      const totalPages = Math.ceil(total / limit)
      return { data: meals, limit, offset, total, totalPages }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('meals'))
    }
  }

  async findById(id: string): Promise<Meal> {
    const meal = await this.mealRepository.findById(id)
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return meal
  }

  async findAllByMemberId(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedMealResult> {
    const { limit, offset } = paginationRequest
    const [meals, total] = await this.mealRepository.findAllByMemberId(memberId, paginationRequest)
    const totalPages = Math.ceil(total / limit)
    return { data: meals, limit, offset, total, totalPages }
  }

  async addMeal(createMealDto: CreateMealDto): Promise<Meal> {
    const meal = this.mealRepository.create(createMealDto)
    return this.mealRepository.save(meal)
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findById(id)
    Object.assign(meal, updateMealDto)
    return this.mealRepository.save(meal)
  }

  async deleteMeal(id: string): Promise<void> {
    const meal = await this.findById(id)
    await this.mealRepository.remove(meal)
  }
}
