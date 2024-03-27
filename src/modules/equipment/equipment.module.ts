import { Module } from '@nestjs/common'
import { EquipmentService } from './equipment.service'
import { EquipmentController } from './equipment.controller'
import { EquipmentRepository } from './equipment.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Equipment } from '../../database/entities/Equipment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Equipment])],
  providers: [EquipmentService, EquipmentRepository],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
