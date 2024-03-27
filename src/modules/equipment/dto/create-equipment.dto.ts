import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { EquipmentType } from '../../enums/Equipment.enum'

export class CreateEquipmentDto {
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  name: string

  @IsEnum(EquipmentType)
  @IsNotEmpty()
  type: EquipmentType

  @IsOptional()
  purchaseDate: Date

  @IsOptional()
  @IsString()
  @Length(0, 255)
  notes: string
}
