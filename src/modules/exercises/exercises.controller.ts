import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Delete,
  HttpCode,
  Patch,
  Body,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Exercise } from '../../database/entities/Exercise.entity'
import { ExerciseService } from './exercises.service'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
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
  ): Promise<PaginatedResultDto<Exercise>> {
    return this.exerciseService.findAllExercisesWithFilter(paginationWithFilter)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Exercise By Id',
    description:
      'Returns an exercise by ID. Returns "Not Found" if exercise with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Exercise> {
    const exercise = this.exerciseService.findByIdOrThrow(id)
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update Existing Exercise',
    description:
      'Updates the details of an exercise specified by its ID using the provided data. Returns "Not Found" if exercise with that ID does not exist.',
  })
  async updateExercise(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: CreateExerciseDto
  ): Promise<void> {
    this.exerciseService.updateExercise(id, updateExerciseDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Exercise',
    description:
      'Deletes an exercise by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteExercise(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.exerciseService.deleteExercise(id)
  }
}
