import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MeasurementRepository } from './measurement.repository'
import { Measurement } from '../../database/entities/Measurement.entity'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../universaldtos/pagination-member-filter.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(MeasurementRepository)
    private readonly measurementRepository: MeasurementRepository
  ) {}

  async findAllMeasurementsWithFilter(
    paginationWithFilter: PaginationWithFilterDto
  ): Promise<PaginatedResultDto<Measurement>> {
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
      throw new NotFoundException(errorMessages.generateDeleteFailed('Measurement'))
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

  async updateMeasurement(id: string, updateMeasurementDto: UpdateMeasurementDto): Promise<void> {
    try {
      const updateResult = await this.measurementRepository.updateMeasurement(
        id,
        updateMeasurementDto
      )
      if (updateResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Measurement'))
      }
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('measurement'))
    }
  }

  async deleteMeasurement(id: string): Promise<void> {
    try {
      const deleteResult = await this.measurementRepository.deleteMeasurement(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Measurement'))
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateDeleteFailed('measurement'))
    }
  }
}
