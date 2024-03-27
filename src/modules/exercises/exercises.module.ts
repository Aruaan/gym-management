import { Module } from '@nestjs/common'
import { ExerciseService } from './exercises.service'
import { ExerciseController } from './exercises.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Exercise } from '../../database/entities/Exercise.entity'
import { ExerciseRepository } from './exercises.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  providers: [ExerciseService, ExerciseRepository],
  controllers: [ExerciseController],
})
export class ExercisesModule {}
