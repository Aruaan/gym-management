import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { MealService } from './meal.service'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Meal } from '../../database/entities/Meal.entity'
import { CreateMealDto } from './dto/create-meal.dto'
import { UpdateMealDto } from './dto/update-meal.dto'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
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
    @Query() paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Meal>> {
    return this.mealService.findAllMealsWithFilter(paginationWithFilter)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Meal By Id',
    description: 'Returns a meal by ID. Returns "Not Found" if meal with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Meal> {
    const meal = await this.mealService.findByIdOrThrow(id)
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update Existing Meal',
    description:
      'Updates the details of a meal specified by its ID using the provided data. Returns "Not Found" if meal with that ID does not exist.',
  })
  async updateMeal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto
  ): Promise<void> {
    await this.mealService.updateMeal(id, updateMealDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Meal',
    description:
      'Deletes a meal by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteMeal(@Param('id') id: string): Promise<void> {
    await this.mealService.deleteMeal(id)
  }
}
