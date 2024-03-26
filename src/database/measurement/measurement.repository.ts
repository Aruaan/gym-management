import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Measurement } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/entities/Measurement.entity'
import { PaginationRequestDto } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/members/dto/pagination-request.dto'
import { DataSource, Repository } from 'typeorm'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { errorMessages } from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'

@Injectable()
export class MeasurementRepository extends Repository<Measurement> {
  constructor(private dataSource: DataSource) {
    super(Measurement, dataSource.createEntityManager())
  }

  async createAndSave(createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    const newMeasurement = this.create(createMeasurementDto)
    return await this.save(newMeasurement)
  }

  async findAllMeasurements(
    paginationRequest: PaginationRequestDto
  ): Promise<[Measurement[], number]> {
    const { limit, page } = paginationRequest
    const offset = (page - 1) * limit

    const queryBuilder = this.createQueryBuilder('measurement')

    try {
      const [measurements, total] = await queryBuilder.skip(offset).take(limit).getManyAndCount()
      return [measurements, total]
    } catch (error) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Measurements'))
    }
  }

  async findById(id: string): Promise<Measurement> {
    const measurement = await this.findOne({
      where: { id: id },
    })
    if (!measurement)
      throw new NotFoundException(errorMessages.generateEntityNotFound('Measurement'))
    return measurement
  }

  async findAllByMemberId(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<[Measurement[], number]> {
    const { limit, page } = paginationRequest
    const offset = (page - 1) * limit

    const query = this.createQueryBuilder('measurement')
      .where('measurement.memberId = :memberId', { memberId })
      .skip(offset)
      .take(limit)
    const [measurements, total] = await query.getManyAndCount()
    return [measurements, total]
  }

  async updateMeasurement(
    id: string,
    updateMeasurementDto: UpdateMeasurementDto
  ): Promise<Measurement> {
    const measurement = await this.findById(id)
    const updated = Object.assign(measurement, updateMeasurementDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('measurement'))
    }
  }

  async deleteMeasurement(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Measurement'))
    }
  }
}
