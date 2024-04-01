import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator'

export class CreateMealDto {
  @IsNotEmpty()
  @IsUUID()
  memberId: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  name: string

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  calories: number

  @IsOptional()
  @IsString()
  @Length(0, 255)
  notes?: string

  @IsDateString()
  createdAt: Date
}
