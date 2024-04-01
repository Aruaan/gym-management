import { Repository, DataSource } from 'typeorm'
import { Equipment } from '../entities/Equipment.entity'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { errorMessages } from '../databaseUtil/utilFunctions'

@Injectable()
export class EquipmentRepository extends Repository<Equipment> {
  constructor(private dataSource: DataSource) {
    super(Equipment, dataSource.createEntityManager())
  }

  async createAndSave(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const existingEquipment = await this.findOne({ where: { name: createEquipmentDto.name } })

    if (existingEquipment) {
      throw new ConflictException('Equipment with that name already exists.')
    }

    const newEquipment = this.create(createEquipmentDto)
    return await this.save(newEquipment)
  }

  async findAll(paginationRequest: PaginationRequestDto): Promise<[Equipment[], number]> {
    const { limit, offset } = paginationRequest

    const [equipment, total] = await Promise.all([
      this.find({ skip: offset, take: limit }),
      this.count(),
    ])

    return [equipment, total]
  }

  async findById(id: string): Promise<Equipment> {
    const equipment = await this.findOne({
      where: { id: id },
    })
    if (!equipment) throw new NotFoundException(errorMessages.generateEntityNotFound('Equipment'))
    return equipment
  }

  async updateEquipment(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findById(id)
    const updated = Object.assign(equipment, updateEquipmentDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('equipment'))
    }
  }

  async deleteEquipment(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Equipment'))
    }
  }
}
