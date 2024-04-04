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
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { MealService } from './meal.service'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginatedMealResult } from './dto/paginated-meal.dto'
import { Meal } from '../../database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
@ApiTags('meals')
@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Meals',
    description:
      'Retrieves a list of meals with pagination. You can specify the number of results to return (limit) and an offset for pagination. Retrieves a list of all meals logged by a single member if a memberID is queried.',
  })
  @ApiQuery({ name: 'memberId', required: false, type: String })
  async findAll(
    @Query() filteredpaginationRequest: PaginationWithFilterDto
  ): Promise<PaginatedMealResult> {
    try {
      return await this.mealService.findAllMealsWithFilter(filteredpaginationRequest)
    } catch (error) {
      throw new HttpException(
        errorMessages.generateFetchingError('meals'),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Meal By Id',
    description: 'Returns a meal by ID. Returns "Not Found" if meal with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Meal> {
    const meal = await this.mealService.findByIdOrThrow(id)
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Existing Meal',
    description:
      'Updates the details of a meal specified by its ID using the provided data. Returns "Not Found" if meal with that ID does not exist.',
  })
  async updateMeal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto
  ): Promise<Meal> {
    const updatedMeal = await this.mealService.updateMeal(id, updateMealDto)

    if (!updatedMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return updatedMeal
  }

  @Delete(':id')
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
