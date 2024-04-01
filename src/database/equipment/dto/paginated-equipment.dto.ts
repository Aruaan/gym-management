import { Equipment } from 'src/database/entities/Equipment.entity'
/**
 * Class representing the result of a paginated query for workouts.
 * Contains the data and pagination details.
 */
export class PaginatedEquipmentResult {
  data: Equipment[]
  limit: number
  offset: number
  total: number
  totalPages: number
}
