import { Repository, DataSource, UpdateResult, DeleteResult } from 'typeorm'
import { Equipment } from '../../database/entities/Equipment.entity'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { Injectable } from '@nestjs/common'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { equipmentAlias } from '../../database/databaseUtil/aliases'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
@Injectable()
export class EquipmentRepository extends Repository<Equipment> {
  constructor(private dataSource: DataSource) {
    super(Equipment, dataSource.createEntityManager())
  }

  async createAndSave(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const newEquipment = this.create(createEquipmentDto)
    return this.save(newEquipment)
  }

  async findAllEquipment(
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedResultDto<Equipment>> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const queryBuilder = this.createQueryBuilder(equipmentAlias).skip(offset).limit(limit)

    const [equipment, count] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(count / limit)

    return { data: equipment, limit, page, count, totalPages }
  }

  async findById(id: string): Promise<Equipment> {
    return this.findOneBy({ id })
  }

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<UpdateResult> {
    return this.update(id, updateEquipmentDto)
  }

  async deleteEquipment(id: string): Promise<DeleteResult> {
    return this.delete(id)
  }
}
