import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { EquipmentRepository } from './equipment.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { Equipment } from '../../database/entities/Equipment.entity'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentRepository) private equipmentRepository: EquipmentRepository
  ) {}

  async findAllEquipment(
    paginationRequestDto: PaginationRequestDto
  ): Promise<PaginatedResultDto<Equipment>> {
    try {
      return await this.equipmentRepository.findAllEquipment({
        limit: paginationRequestDto.limit,
        page: paginationRequestDto.page,
      })
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('equipment'))
    }
  }

  async addEquipment(createEquipmentDto: CreateEquipmentDto) {
    try {
      return this.equipmentRepository.createAndSave(createEquipmentDto)
    } catch (error) {
      throw new InternalServerErrorException('Error adding equipment')
    }
  }

  async findByIdOrThrow(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findById(id)
    if (!equipment) throw new NotFoundException(errorMessages.generateEntityNotFound('Equipment'))
    return equipment
  }

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<void> {
    try {
      const updateResult = await this.equipmentRepository.updateEquipment(id, updateEquipmentDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Equipment'))
      }
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('equipment'))
    }
  }

  async deleteEquipment(id: string): Promise<void> {
    try {
      const deleteResult = await this.equipmentRepository.deleteEquipment(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Equipment'))
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateDeleteFailed('equipment'))
    }
  }
}
