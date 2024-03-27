import { Optional } from '@nestjs/common'
import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator'
import { ExerciseType } from '../../enums/Exercise.enum'

export class CreateExerciseDto {
  @IsUUID()
  @IsNotEmpty()
  workoutId: string

  @IsEnum(ExerciseType)
  @IsNotEmpty()
  type: ExerciseType

  @IsString()
  @Length(1, 40)
  @IsNotEmpty()
  name: string

  @IsInt()
  @IsNotEmpty()
  setCount: number

  @IsInt()
  @IsNotEmpty()
  repCount: number

  @IsInt()
  @IsNotEmpty()
  weight: number

  @IsString()
  @Length(0, 255)
  @Optional()
  notes: string
}
