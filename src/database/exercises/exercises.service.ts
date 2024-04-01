import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExerciseRepository } from './exercises.repository'
import { PaginationRequestDto } from 'src/database/members/dto/pagination-request.dto'
import { PaginatedExerciseResult } from './dto/paginated-exercise.dto'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { Exercise } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Exercise.entity'

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository
  ) {}

  async findAllExercises(
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedExerciseResult> {
    return this.exerciseRepository.findAllExercises(paginationRequest)
  }

  async findAllByWorkoutId(
    workoutId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedExerciseResult> {
    return this.exerciseRepository.findAllByWorkoutId(workoutId, paginationRequest)
  }

  async findById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findById(id)
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`)
    }
    return exercise
  }

  async addExercise(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto)
    return this.exerciseRepository.save(exercise)
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findById(id)
    Object.assign(exercise, updateExerciseDto)
    return this.exerciseRepository.save(exercise)
  }

  async deleteExercise(id: string): Promise<void> {
    const exercise = await this.findById(id)
    await this.exerciseRepository.remove(exercise)
  }
}
