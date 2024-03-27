import { Workout } from 'src/database/entities/Workout.entity'
/**
 * Class representing the result of a paginated query for workouts.
 * Contains the data and pagination details.
 */
export class PaginatedWorkoutResult {
  data: Workout[]
  limit: number
  offset: number
  total: number
  totalPages: number
}
