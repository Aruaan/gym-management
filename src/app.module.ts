import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { MemberModule } from './database/members/members.module'
import { WorkoutModule } from './database/workouts/workouts.module'
import { ExercisesModule } from './database/exercises/exercises.module'
import { MealModule } from './database/meals/meal.module'

@Module({
  imports: [DatabaseModule, MemberModule, WorkoutModule, ExercisesModule, MealModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
