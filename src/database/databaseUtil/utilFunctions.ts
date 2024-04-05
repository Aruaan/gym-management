export const errorMessages = {
  generateEntityNotFound: (entity: string) => `${entity} not found.`,
  generateUpdateFailed: (entity: string) => `Error updating ${entity}`,
  generateFetchingError: (entity: string) => `Error fetching ${entity}`,
  generateDeleteFailed: (entity: string) => `Error deleting ${entity}`,
}

export function calculateOffset(limit: number, page: number): number {
  return (page - 1) * limit
}
