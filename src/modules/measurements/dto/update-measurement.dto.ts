import { CreateMeasurementDto } from './create-measurement.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateMeasurementDto extends PartialType(CreateMeasurementDto) {}
