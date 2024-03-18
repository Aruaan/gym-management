import { Module } from '@nestjs/common'
import { MeasurementController } from './measurement.controller'
import { MeasurementService } from './measurement.service'
import { MeasurementRepository } from './measurement.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Measurement } from '../entities/Measurement.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Measurement])],

  controllers: [MeasurementController],
  providers: [MeasurementService, MeasurementRepository],
})
export class MeasurementModule {}
