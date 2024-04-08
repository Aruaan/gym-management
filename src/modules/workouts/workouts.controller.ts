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
import { WorkoutService } from './workouts.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Workout } from '../../database/entities/Workout.entity'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
@ApiTags('workouts')
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Workouts',
    description:
      'Retrieves a list of workouts with pagination. You can specify the number of results to return (limit) and an offset for pagination. Retrieves a list of all workouts logged by a single member if a memberID is queried.',
  })
  async findAll(
    @Query() paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Workout>> {
    return this.workoutService.findAllWorkoutsWithFilter(paginationWithFilter)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Workout By Id',
    description:
      'Returns a workout by ID. Returns "Not Found" if workout with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Workout> {
    const workout = await this.workoutService.findByIdOrThrow(id)
    return workout
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Workout',
    description:
      'Creates a new workout with the provided details. Returns data of the newly added workout.',
  })
  async addWorkout(@Body() createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    return this.workoutService.addWorkout(createWorkoutDto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Existing Workout',
    description:
      'Updates the details of a workout specified by its ID using the provided data. Returns "Not Found" if workout with that ID does not exist.',
  })
  async updateWorkout(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto
  ): Promise<void> {
    this.workoutService.updateWorkout(id, updateWorkoutDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Workout',
    description:
      'Deletes a workout by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteWorkout(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.workoutService.deleteWorkout(id)
  }
}
