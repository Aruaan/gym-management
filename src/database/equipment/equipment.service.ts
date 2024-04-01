import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { EquipmentRepository } from './equipment.repository'
import { PaginatedEquipmentResult } from './dto/paginated-equipment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { Equipment } from '../entities/Equipment.entity'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { errorMessages } from '../databaseUtil/utilFunctions'

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentRepository) private equipmentRepository: EquipmentRepository
  ) {}

  async findAllEquipment(
    paginationRequestDto: PaginationRequestDto
  ): Promise<PaginatedEquipmentResult> {
    try {
      const { limit, offset } = paginationRequestDto
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

  async findById(id: string): Promise<Equipment> {
    return await this.equipmentRepository.findById(id)
  }

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const allowedUpdateFields = ['name', 'type', 'purchaseDate', 'notes']
    Object.keys(updateEquipmentDto).forEach((key) => {
      if (!allowedUpdateFields.includes(key)) {
        throw new BadRequestException(`Invalid field name ${key}`)
      }
    })
    return await this.equipmentRepository.updateEquipment(id, updateEquipmentDto)
  }

  async deleteEquipment(id: string): Promise<void> {
    return await this.equipmentRepository.deleteEquipment(id)
  }
}
