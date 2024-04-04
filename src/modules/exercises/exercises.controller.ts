import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  Delete,
  HttpCode,
  Patch,
  Body,
  InternalServerErrorException,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { Exercise } from '../../database/entities/Exercise.entity'
import { ExerciseService } from './exercises.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { PaginatedExerciseResult } from './dto/paginated-exercise.dto'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Exercises',
    description:
      'Retrieves a list of exercises with pagination. You can specify the number of results to return (limit) and an offset for pagination. Retrieves a list of all exercises logged for a single workout if a workoutId is queried.',
  })
  async findAll(
    @Query() paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedExerciseResult> {
    try {
      return await this.exerciseService.findAllExercisesWithFilter({
        limit: paginationWithFilter.limit,
        page: paginationWithFilter.page,
        workoutId: paginationWithFilter.workoutId || null,
      })
    } catch (error) {
      console.error(error)
      throw new HttpException(
        errorMessages.generateFetchingError('exercises'),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Exercise By Id',
    description:
      'Returns an exercise by ID. Returns "Not Found" if exercise with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Exercise> {
    const exercise = await this.exerciseService.findByIdOrThrow(id)
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`)
    }
    return exercise
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Exercise',
    description:
      'Creates a new exercise with the provided details. Returns data of the newly added exercise.',
  })
  async addExercise(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exerciseService.addExercise(createExerciseDto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Existing Exercise',
    description:
      'Updates the details of an exercise specified by its ID using the provided data. Returns "Not Found" if exercise with that ID does not exist.',
  })
  async updateExercise(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: CreateExerciseDto
  ): Promise<Exercise> {
    const updatedExercise = await this.exerciseService.updateExercise(id, updateExerciseDto)

    if (!updatedExercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`)
    }
    return updatedExercise
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Exercise',
    description:
      'Deletes an exercise by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteExercise(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.exerciseService.deleteExercise(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('Error deleting exercise')
      }
    }
  }
}
