import { Repository, DataSource } from 'typeorm'
import { Equipment } from '../../database/entities/Equipment.entity'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { Injectable } from '@nestjs/common'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { equipmentAlias } from '../../database/databaseUtil/aliases'
import { PaginatedEquipmentResult } from './dto/paginated-equipment.dto'
@Injectable()
export class EquipmentRepository extends Repository<Equipment> {
  constructor(private dataSource: DataSource) {
    super(Equipment, dataSource.createEntityManager())
  }

  async createAndSave(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const newEquipment = this.create(createEquipmentDto)
    return await this.save(newEquipment)
  }

  async findAllEquipment(
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedEquipmentResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)
    const queryBuilder = this.createQueryBuilder(equipmentAlias).skip(offset).limit(limit)

    const [equipment, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / limit)
    return { data: equipment, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Equipment> {
    return await this.findOneBy({ id })
  }

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findById(id)
    const updated = Object.assign(equipment, updateEquipmentDto)

    await this.save(updated)
    return updated
  }

  async deleteEquipment(id: string): Promise<void> {
    await this.delete(id)
  }
}
