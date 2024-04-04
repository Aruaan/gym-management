import { Injectable } from '@nestjs/common'
import { Measurement } from '../../database/entities/Measurement.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
import { PaginatedMeasurementResult } from './dto/paginated-measurement'
import { measurementAlias } from '../../database/databaseUtil/aliases'

@Injectable()
export class MeasurementRepository extends Repository<Measurement> {
  constructor(private dataSource: DataSource) {
    super(Measurement, dataSource.createEntityManager())
  }

  async createAndSave(createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    const newMeasurement = this.create(createMeasurementDto)
    return await this.save(newMeasurement)
  }

  async findAllMeasurementsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedMeasurementResult> {
    const { limit, page, memberId } = paginationWithFilter
    const offset = calculateOffset(limit, page)

    let queryBuilder = this.createQueryBuilder(measurementAlias).skip(offset).limit(limit)
    if (memberId) {
      queryBuilder = queryBuilder.where('measurement.member_id = :memberId', { memberId })
    }

    const [measurements, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / limit)
    return { data: measurements, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Measurement> {
    return await this.findOneBy({ id })
  }

  async updateMeasurement(
    id: string,
    updateMeasurementDto: UpdateMeasurementDto
  ): Promise<Measurement> {
    const measurement = await this.findById(id)
    const updated = Object.assign(measurement, updateMeasurementDto)

    await this.save(updated)
    return updated
  }

  async deleteMeasurement(id: string): Promise<void> {
    await this.delete(id)
  }
}
