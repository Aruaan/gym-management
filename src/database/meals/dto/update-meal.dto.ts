import { CreateMealDto } from './create-meal.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateMealDto extends PartialType(CreateMealDto) {}
