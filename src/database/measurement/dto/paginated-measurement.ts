import { Measurement } from 'src/database/entities/Measurement.entity'
/**
 * Class representing the result of a paginated query for workouts.
 * Contains the data and pagination details.
 */
export class PaginatedMeasurementResult {
  data: Measurement[]
  limit: number
  offset: number
  total: number
  totalPages: number
}
