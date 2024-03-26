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
} from '@nestjs/common'
import { WorkoutService } from './workouts.service'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { errorMessages } from '../databaseUtil/utilFunctions'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { PaginatedWorkoutResult } from './dto/paginated-workout.dto'
import { Workout } from '../entities/Workout.entity'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { CreateWorkoutDto } from './dto/create-workout.dto'
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
  @ApiQuery({ name: 'memberId', required: false, type: String })
  async findAll(
    @Query('paginationRequest') paginationRequest?: PaginationRequestDto,
    @Query('memberId') memberId?: string
  ): Promise<PaginatedWorkoutResult> {
    if (memberId)
      return this.workoutService.findAllByMemberId(paginationRequest, memberId).catch(() => {
        throw new HttpException(
          errorMessages.generateFetchingError('workouts'),
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      })

    return this.workoutService.findAllWorkouts(paginationRequest).catch(() => {
      throw new HttpException(
        errorMessages.generateFetchingError('workouts'),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Workout By Id',
    description:
      'Returns a workout by ID. Returns "Not Found" if workout with that ID does not exist.',
  })
  async findById(@Param('id') id: string): Promise<Workout> {
    const workout = await this.workoutService.findById(id)
    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`)
    }
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

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update Existing Workout',
    description:
      'Updates the details of a workout specified by its ID using the provided data. Returns "Not Found" if workout with that ID does not exist.',
  })
  async updateWorkout(
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto
  ): Promise<Workout> {
    const updatedWorkout = await this.workoutService.updateWorkout(id, updateWorkoutDto)

    if (!updatedWorkout) {
      throw new NotFoundException(`Workout with ID ${id} not found`)
    }
    return updatedWorkout
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Workout',
    description:
      'Deletes a workout by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteWorkout(@Param('id') id: string): Promise<void> {
    try {
      await this.workoutService.deleteWorkout(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('Error deleting workout')
      }
    }
  }
}
