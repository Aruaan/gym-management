import { Optional } from '@nestjs/common'
import { IsEnum, IsString, IsUUID, Length } from 'class-validator'
import { WorkoutType } from '../../enums/Workout.enum'

export class CreateWorkoutDto {
  @IsUUID()
  memberId: string

  @IsEnum(WorkoutType)
  type: WorkoutType

  @IsString()
  @Length(0, 255)
  @Optional()
  notes: string
}
