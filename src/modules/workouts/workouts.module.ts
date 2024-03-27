import { Module } from '@nestjs/common'
import { WorkoutService } from './workouts.service'
import { WorkoutController } from './workouts.controller'
import { WorkoutRepository } from './workouts.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Workout } from '../../database/entities/Workout.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Workout])],
  providers: [WorkoutService, WorkoutRepository],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
