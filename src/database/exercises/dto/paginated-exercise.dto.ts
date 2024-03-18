import { Exercise } from 'src/database/entities/Exercise.entity'
/**
 * Class representing the result of a paginated query for workouts.
 * Contains the data and pagination details.
 */
export class PaginatedExerciseResult {
  data: Exercise[]
  limit: number
  offset: number
  total: number
  totalPages: number
}
