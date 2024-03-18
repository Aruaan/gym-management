import { Module } from '@nestjs/common'
import { MealController } from './meal.controller'
import { MealService } from './meal.service'
import { Meal } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Meal.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MealRepository } from './meal.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],

  controllers: [MealController],
  providers: [MealService, MealRepository],
})
export class MealModule {}
