import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class PaginationRequestDto {
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ type: Number, default: 10 })
  limit: number

  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ type: Number, default: 1 })
  page: number
}
