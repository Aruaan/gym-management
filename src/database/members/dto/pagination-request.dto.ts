import { IsNumber, Min } from 'class-validator'

export class PaginationRequestDto {
  @IsNumber()
  @Min(0)
  limit: number
  @Min(0)
  @IsNumber()
  offset: number
}
