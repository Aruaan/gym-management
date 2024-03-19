import { Optional } from '@nestjs/common'
import { IsEnum, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator'
import { WorkoutType } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/enums/Workout.enum'

export class CreateWorkoutDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string

  @IsEnum(WorkoutType)
  @IsNotEmpty()
  type: WorkoutType

  @IsString()
  @Length(0, 255)
  @Optional()
  notes: string
}
