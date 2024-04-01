import { Meal } from 'src/database/entities/Meal.entity'
/**
 * Class representing the result of a paginated query for members.
 * Contains the data and pagination details.
 */
export class PaginatedMealResult {
  data: Meal[]
  limit: number
  offset: number
  total: number
  totalPages: number
}
