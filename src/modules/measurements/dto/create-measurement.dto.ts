import { IsDate, IsNumber, IsOptional, IsUUID, IsNotEmpty } from 'class-validator'

export class CreateMeasurementDto {
  @IsUUID()
  memberId: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  @IsNumber()
  @IsNotEmpty()
  weight: number

  @IsNumber()
  @IsOptional()
  bodyFatPercentage?: number | null
}
