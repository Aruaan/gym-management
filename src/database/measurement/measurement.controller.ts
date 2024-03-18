import { Controller, Get, Param, Query, Post, Body, Patch, Delete } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { PaginationRequestDto } from '../members/dto/pagination-request.dto'
import { PaginatedMeasurementResult } from './dto/paginated-measurement'
import { Measurement } from '../entities/Measurement.entity'
import { MeasurementService } from './measurement.service'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'

@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Measurements',
    description:
      'Retrieves a list of measurements with pagination. You can specify the number of results to return (limit) and an offset for pagination. Retrieves a list of all measurements logged by a single member if a memberID is queried.',
  })
  async findAll(
    @Query() paginationRequest: PaginationRequestDto,
    @Query('memberId') memberId?: string
  ): Promise<PaginatedMeasurementResult> {
    if (memberId) {
      return this.measurementService.findAllByMemberId(memberId, paginationRequest)
    }
    return this.measurementService.findAllMeasurements(paginationRequest)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Measurement By Id',
    description:
      'Returns a measurement by ID. Returns "Not Found" if measurement with that ID does not exist.',
  })
  async findById(@Param('id') id: string): Promise<Measurement> {
    return this.measurementService.findById(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Measurement',
    description: 'Creates a new measurement with the provided details.',
  })
  async addMeasurement(@Body() createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    return this.measurementService.addMeasurement(createMeasurementDto)
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update Measurement',
    description:
      'Updates the details of a measurement specified by its ID using the provided data.',
  })
  async updateMeasurement(
    @Param('id') id: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto
  ): Promise<Measurement> {
    return this.measurementService.updateMeasurement(id, updateMeasurementDto)
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete Measurement',
    description: 'Deletes a measurement by ID.',
  })
  async deleteMeasurement(@Param('id') id: string): Promise<void> {
    return this.measurementService.deleteMeasurement(id)
  }

  @Get('member/:memberId')
  @ApiOperation({
    summary: 'Find Measurements By Member Id',
    description: 'Returns a list of measurements logged by a single member.',
  })
  async findAllByMemberId(
    @Param('memberId') memberId: string,
    @Query() paginationRequest: PaginationRequestDto
  ): Promise<PaginatedMeasurementResult> {
    return this.measurementService.findAllByMemberId(memberId, paginationRequest)
  }
}
