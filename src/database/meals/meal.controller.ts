import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { MealService } from './meal.service'
import { ApiOperation } from '@nestjs/swagger'
import { errorMessages } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { PaginationRequestDto } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/members/dto/pagination-request.dto'
import { PaginatedMealResult } from './dto/paginated-meal.dto'
import { Meal } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Meals',
    description:
      'Retrieves a list of meals with pagination. You can specify the number of results to return (limit) and an offset for pagination. Retrieves a list of all meals logged by a single member if a memberID is queried.',
  })
  async findAll(
    @Query() paginationRequest: PaginationRequestDto,
    @Query('memberId') memberId?: string
  ): Promise<PaginatedMealResult> {
    if (memberId)
      return this.mealService.findAllByMemberId(memberId, paginationRequest).catch(() => {
        throw new HttpException(
          errorMessages.generateFetchingError('meals'),
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      })
    return this.mealService.findAllMeals(paginationRequest).catch(() => {
      throw new HttpException(
        errorMessages.generateFetchingError('meals'),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Meal By Id',
    description: 'Returns a meal by ID. Returns "Not Found" if meal with that ID does not exist.',
  })
  async findById(@Param('id') id: string): Promise<Meal> {
    const meal = await this.mealService.findById(id)
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return meal
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Meal',
    description:
      'Creates a new meal with the provided details. Returns data of the newly added meal.',
  })
  async addMeal(@Body() createMealDto: CreateMealDto): Promise<Meal> {
    return this.mealService.addMeal(createMealDto)
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update Existing Meal',
    description:
      'Updates the details of a meal specified by its ID using the provided data. Returns "Not Found" if meal with that ID does not exist.',
  })
  async updateMeal(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto): Promise<Meal> {
    const updatedMeal = await this.mealService.updateMeal(id, updateMealDto)

    if (!updatedMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return updatedMeal
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Meal',
    description:
      'Deletes a meal by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteMeal(@Param('id') id: string): Promise<void> {
    try {
      await this.mealService.deleteMeal(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('Error deleting meal')
      }
    }
  }
}
