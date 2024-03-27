import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MeasurementRepository } from './measurement.repository'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { PaginatedMeasurementResult } from './dto/paginated-measurement'
import { Measurement } from '../../database/entities/Measurement.entity'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import {
  calculateOffset,
  errorMessages,
} from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(MeasurementRepository)
    private readonly measurementRepository: MeasurementRepository
  ) {}

  async findAllMeasurements(
    paginationRequestDto: PaginationRequestDto
  ): Promise<PaginatedMeasurementResult> {
    try {
      const { limit, page } = paginationRequestDto
      const offset = calculateOffset(limit, page)

      const [measurements, total] =
        await this.measurementRepository.findAllMeasurements(paginationRequestDto)
      const totalPages = Math.ceil(total / limit)
      return { data: measurements, limit, offset, total, totalPages }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('measurements'))
    }
  }

  async findByIdOrThrow(id: string): Promise<Measurement> {
    const measurement = await this.measurementRepository.findByIdOrThrow(id)
    if (!measurement) {
      throw new NotFoundException(`Measurement with ID ${id} not found`)
    }
    return measurement
  }

  async findAllByMemberIdOrThrow(
    memberId: string,
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedMeasurementResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const [measurements, total] = await this.measurementRepository.findAllByMemberIdOrThrow(
      memberId,
      paginationRequest
    )
    const totalPages = Math.ceil(total / limit)
    return { data: measurements, limit, offset, total, totalPages }
  }

  async addMeasurement(createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    const measurement = this.measurementRepository.create(createMeasurementDto)
    return this.measurementRepository.save(measurement)
  }

  async updateMeasurement(
    id: string,
    updateMeasurementDto: UpdateMeasurementDto
  ): Promise<Measurement> {
    const measurement = await this.findByIdOrThrow(id)
    Object.assign(measurement, updateMeasurementDto)
    return this.measurementRepository.save(measurement)
  }

  async deleteMeasurement(id: string): Promise<void> {
    const measurement = await this.findByIdOrThrow(id)
    await this.measurementRepository.remove(measurement)
  }
}
