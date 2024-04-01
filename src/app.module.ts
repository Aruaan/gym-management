import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { MemberModule } from './modules/members/members.module'
import { WorkoutModule } from './modules/workouts/workouts.module'
import { ExercisesModule } from './modules/exercises/exercises.module'
import { MealModule } from './modules/meals/meal.module'
import { EquipmentModule } from './modules/equipment/equipment.module'
import { MeasurementModule } from './modules/measurements/measurement.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    DatabaseModule,
    MemberModule,
    WorkoutModule,
    ExercisesModule,
    MealModule,
    EquipmentModule,
    MeasurementModule,
    AuthModule,
  ],
})
export class AppModule {}
