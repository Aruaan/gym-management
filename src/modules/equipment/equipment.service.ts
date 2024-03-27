import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { EquipmentRepository } from './equipment.repository'
import { PaginatedEquipmentResult } from './dto/paginated-equipment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { Equipment } from '../../database/entities/Equipment.entity'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import {
  calculateOffset,
  errorMessages,
} from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentRepository) private equipmentRepository: EquipmentRepository
  ) {}

  async findAllEquipment(
    paginationRequestDto: PaginationRequestDto
  ): Promise<PaginatedEquipmentResult> {
    try {
      const { limit, page } = paginationRequestDto
      const offset = calculateOffset(limit, page)

      const [equipment, total] = await this.equipmentRepository.findAll(paginationRequestDto)
      const totalPages = Math.ceil(total / limit)
      return { data: equipment, limit, offset, total, totalPages }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('equipment'))
    }
  }

  async addEquipment(createEquipmentDto: CreateEquipmentDto) {
    try {
      const newEquipment = this.equipmentRepository.create(createEquipmentDto)
      return await this.equipmentRepository.save(newEquipment)
    } catch (error) {
      throw new InternalServerErrorException('Error adding equipment')
    }
  }

  async findByIdOrThrow(id: string): Promise<Equipment> {
    return await this.equipmentRepository.findByIdOrThrow(id)
  }

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    return await this.equipmentRepository.updateEquipment(id, updateEquipmentDto)
  }

  async deleteEquipment(id: string): Promise<void> {
    return await this.equipmentRepository.deleteEquipment(id)
  }
}
