import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { CreateEquipmentDto } from './dto/create-equipment.dto'
import { Equipment } from '../../database/entities/Equipment.entity'
import { EquipmentService } from './equipment.service'
import { UpdateEquipmentDto } from './dto/update-equipment.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
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
  ): Promise<PaginatedResultDto<Equipment>> {
    return this.equipmentService.findAllEquipment(paginationRequest)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Equipment By Id',
    description:
      'Returns equipment by ID. Returns "Not Found" if equipment with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Equipment> {
    const equipment = await this.equipmentService.findByIdOrThrow(id)
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateEquipment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto
  ): Promise<void> {
    await this.equipmentService.updateEquipment(id, updateEquipmentDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Equipment',
    description:
      'Deletes equipment by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteEquipment(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.equipmentService.deleteEquipment(id)
  }
}
