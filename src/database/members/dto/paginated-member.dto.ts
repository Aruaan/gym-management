import { Member } from 'src/database/entities/Member.entity'
/**
 * Class representing the result of a paginated query for members.
 * Contains the data and pagination details.
 */
export class PaginatedMemberResult {
  data: Member[]
  limit: number
  offset: number
  total: number
  totalPages: number
}
