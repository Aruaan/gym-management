import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Patch,
  Delete,
  InternalServerErrorException,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginatedMeasurementResult } from './dto/paginated-measurement'
import { Measurement } from '../../database/entities/Measurement.entity'
import { MeasurementService } from './measurement.service'
import { CreateMeasurementDto } from './dto/create-measurement.dto'
import { UpdateMeasurementDto } from './dto/update-measurement.dto'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginationWithFilterDto } from '../members/dto/pagination-member-filter.dto'
@ApiTags('measurements')
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
    @Query() filteredPaginationRequest: PaginationWithFilterDto
  ): Promise<PaginatedMeasurementResult> {
    try {
      return await this.measurementService.findAllMeasurementsWithFilter(filteredPaginationRequest)
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('measurements'))
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Measurement By Id',
    description:
      'Returns a measurement by ID. Returns "Not Found" if measurement with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Measurement> {
    return this.measurementService.findByIdOrThrow(id)
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Measurement',
    description: 'Creates a new measurement with the provided details.',
  })
  async addMeasurement(@Body() createMeasurementDto: CreateMeasurementDto): Promise<Measurement> {
    return this.measurementService.addMeasurement(createMeasurementDto)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Measurement',
    description:
      'Updates the details of a measurement specified by its ID using the provided data.',
  })
  async updateMeasurement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto
  ): Promise<Measurement> {
    return this.measurementService.updateMeasurement(id, updateMeasurementDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Measurement',
    description: 'Deletes a measurement by ID.',
  })
  async deleteMeasurement(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.measurementService.deleteMeasurement(id)
  }
}
