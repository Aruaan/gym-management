import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MeasurementRepository } from './measurement.repository'
import { PaginatedMeasurementResult } from './dto/paginated-measurement'
import { Measurement } from '../../database/entities/Measurement.entity'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(MeasurementRepository)
    private readonly measurementRepository: MeasurementRepository
  ) {}

  async findAllMeasurementsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedMeasurementResult> {
    try {
      return this.measurementRepository.findAllMeasurementsWithFilter({
        limit: paginationWithFilter.limit,
        page: paginationWithFilter.page,
        memberId: paginationWithFilter.memberId || null,
      })
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('meals'))
    }
  }

  async findByIdOrThrow(id: string): Promise<Measurement> {
    const measurement = await this.measurementRepository.findById(id)
    if (!measurement) {
      throw new NotFoundException(`Measurement with ID ${id} not found`)
    }
    return measurement
  }

  async addMeasurement(createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    try {
      return this.measurementRepository.createAndSave(createMeasurementDto)
    } catch (err) {
      throw new InternalServerErrorException('Error adding measurement.')
    }
  }

  async updateMeasurement(
    id: string,
    updateMeasurementDto: UpdateMeasurementDto
  ): Promise<Measurement> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Measurement'))

    try {
      return await this.measurementRepository.updateMeasurement(id, updateMeasurementDto)
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('meals'))
    }
  }

  async deleteMeasurement(id: string): Promise<void> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Measurement'))
    return await this.measurementRepository.deleteMeasurement(id)
  }
}
