import { Optional } from '@nestjs/common'
import { IsDate, IsNumber, IsOptional, IsUUID, IsNotEmpty } from 'class-validator'

export class CreateMeasurementDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string

  @IsDate()
  @Optional()
  createdAt: Date

  @IsNumber()
  @IsNotEmpty()
  weight: number

  @IsNumber()
  @IsOptional()
  bodyFatPercentage: number | null
}
