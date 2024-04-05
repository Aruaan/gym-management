/**
 * Generic type dto for all paginated results
 * Contains the data and pagination details.
 */
export class PaginatedResultDto<T> {
  data: T[]
  limit: number
  page: number
  count: number
  totalPages: number
}
