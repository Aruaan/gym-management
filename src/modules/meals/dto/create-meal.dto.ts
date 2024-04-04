import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length } from 'class-validator'

export class CreateMealDto {
  @IsUUID()
  memberId: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  name: string

  @IsNumber()
  @IsNotEmpty()
  calories: number

  @IsOptional()
  @IsString()
  @Length(0, 255)
  notes?: string

  @IsDate()
  @IsOptional()
  createdAt?: Date
}
