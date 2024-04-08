import { Injectable } from '@nestjs/common'
import { Measurement } from '../../database/entities/Measurement.entity'
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { measurementAlias } from '../../database/databaseUtil/aliases'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class MeasurementRepository extends Repository<Measurement> {
  constructor(private dataSource: DataSource) {
    super(Measurement, dataSource.createEntityManager())
  }

  async createAndSave(createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    const newMeasurement = this.create(createMeasurementDto)
    return this.save(newMeasurement)
  }

  async findAllMeasurementsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Measurement>> {
    const { limit, page, memberId } = paginationWithFilter
    const offset = calculateOffset(limit, page)

    let queryBuilder = this.createQueryBuilder(measurementAlias).skip(offset).limit(limit)
    if (memberId) {
      queryBuilder = queryBuilder.where('measurement.member_id = :memberId', { memberId })
    }

    const [measurements, count] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(count / limit)
    return { data: measurements, limit, page, count, totalPages }
  }

  async findById(id: string): Promise<Measurement> {
    return this.findOneBy({ id })
  }

  async updateMeasurement(
    id: string,
    updateMeasurementDto: UpdateMeasurementDto
  ): Promise<UpdateResult> {
    return this.update(id, updateMeasurementDto)
  }

  async deleteMeasurement(id: string): Promise<DeleteResult> {
    return this.delete(id)
  }
}
