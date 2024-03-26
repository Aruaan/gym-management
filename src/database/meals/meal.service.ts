import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MealRepository } from './meal.repository'
import { PaginationRequestDto } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/members/dto/pagination-request.dto'
import { PaginatedMealResult } from './dto/paginated-meal.dto'
import { Meal } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { errorMessages } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { DataSource } from 'typeorm'

@Injectable()
export class MealService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MealRepository)
    private readonly mealRepository: MealRepository
  ) {}

  async findAllMeals(paginationRequestDto: PaginationRequestDto): Promise<PaginatedMealResult> {
    console.log('findAllMeals called') // Add this line

    try {
      const { limit, page } = paginationRequestDto
      const offset = (page - 1) * limit
      console.log(offset, limit, page)
      const [meals, total] = await this.mealRepository.findAll({ skip: offset, take: limit })
      const totalPages = Math.ceil(total / limit)
      return { data: meals, limit, offset, total, totalPages }
    } catch (error) {
      console.error(error)
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
    const { limit, page } = paginationRequest
    const offset = (page - 1) * limit

    const [meals, total] = await this.mealRepository.findAllByMemberId(memberId, paginationRequest)
    const totalPages = Math.ceil(total / limit)
    return { data: meals, limit, offset, total, totalPages }
  }

  async addMeal(createMealDto: CreateMealDto): Promise<Meal> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const meal = this.mealRepository.create(createMealDto)
      const savedMeal = await queryRunner.manager.save(meal)
      throw new BadRequestException('Simulated error')
      const savedMeal2 = await queryRunner.manager.save(meal)
      await queryRunner.commitTransaction()
      return savedMeal
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async updateMeal(id: string, updateMealDto: UpdateMealDto): Promise<Meal> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const meal = await queryRunner.manager.findOne(Meal, { where: { id } }) // Use queryRunner

      if (!meal) {
        throw new NotFoundException(`Meal with ID ${id} not found`)
      }

      Object.assign(meal, updateMealDto)

      await queryRunner.manager.save(meal) // Use queryRunner

      await queryRunner.commitTransaction()
      return meal
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async deleteMeal(id: string): Promise<void> {
    const meal = await this.findById(id)
    await this.mealRepository.remove(meal)
  }
}
