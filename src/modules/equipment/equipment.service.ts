import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { EquipmentRepository } from './equipment.repository'
import { PaginatedEquipmentResult } from './dto/paginated-equipment.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { Equipment } from '../../database/entities/Equipment.entity'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentRepository) private equipmentRepository: EquipmentRepository
  ) {}

  async findAllEquipment(
    paginationRequestDto: PaginationRequestDto
  ): Promise<PaginatedEquipmentResult> {
    try {
      return this.equipmentRepository.findAllEquipment({
        limit: paginationRequestDto.limit,
        page: paginationRequestDto.page,
      })
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('equipment'))
    }
  }

  async addEquipment(createEquipmentDto: CreateEquipmentDto) {
    const existingEquipment = await this.equipmentRepository.findOneBy({
      name: createEquipmentDto.name,
    })
    if (existingEquipment) {
      throw new ConflictException('Equipment with that name already exists.')
    }
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

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    try {
      return await this.equipmentRepository.updateEquipment(id, updateEquipmentDto)
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('equipment'))
    }
  }

  async deleteEquipment(id: string): Promise<void> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Equipment'))

    return await this.equipmentRepository.deleteEquipment(id)
  }
}
