import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class PaginationRequestDto {
  @IsNumber()
  @ApiPropertyOptional({ type: Number, default: 10 })
  @IsOptional()
  limit?: number = 10

  @IsNumber()
  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  page?: number = 1
}
