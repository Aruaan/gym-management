import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { MemberModule } from './database/members/members.module'
import { WorkoutModule } from './database/workouts/workouts.module'
import { ExercisesModule } from './database/exercises/exercises.module'
import { MealModule } from './database/meals/meal.module'
import { EquipmentModule } from './database/equipment/equipment.module'

@Module({
  imports: [
    DatabaseModule,
    MemberModule,
    WorkoutModule,
    ExercisesModule,
    MealModule,
    EquipmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
