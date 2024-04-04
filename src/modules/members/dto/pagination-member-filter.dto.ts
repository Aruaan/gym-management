import { IsOptional } from 'class-validator'
import { PaginationRequestDto } from './pagination-request.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationWithFilterDto extends PaginationRequestDto {
  @IsOptional()
  @ApiPropertyOptional()
  memberId?: string

  @IsOptional()
  @ApiPropertyOptional()
  workoutId?: string
}
