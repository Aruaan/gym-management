import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { Equipment } from '../../database/entities/Equipment.entity'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { EquipmentService } from './equipment.service'
import { PaginatedEquipmentResult } from './dto/paginated-equipment.dto'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
@ApiTags('equipments')
@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Equipment',
    description: 'Retrieves a list of equipment with pagination.',
  })
  async findAll(
    @Query() paginationRequest: PaginationRequestDto
  ): Promise<PaginatedEquipmentResult> {
    return this.equipmentService.findAllEquipment(paginationRequest).catch(() => {
      throw new HttpException(
        errorMessages.generateFetchingError('equipment'),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Equipment By Id',
    description:
      'Returns equipment by ID. Returns "Not Found" if equipment with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Equipment> {
    const equipment = await this.equipmentService.findByIdOrThrow(id)
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`)
    }
    return equipment
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Equipment',
    description:
      'Creates a new equipment with the provided details. Returns data of the newly added equipment.',
  })
  async addEquipment(@Body() createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    return this.equipmentService.addEquipment(createEquipmentDto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Existing Equipment',
    description:
      'Updates the details of equipment specified by its ID using the provided data. Returns "Not Found" if equipment with that ID does not exist.',
  })
  async updateEquipment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto
  ): Promise<Equipment> {
    const updatedEquipment = await this.equipmentService.updateEquipment(id, updateEquipmentDto)

    if (!updatedEquipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`)
    }
    return updatedEquipment
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Equipment',
    description:
      'Deletes equipment by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteEquipment(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.equipmentService.deleteEquipment(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('Error deleting equipment')
      }
    }
  }
}
