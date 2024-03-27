import { Test, TestingModule } from '@nestjs/testing'
import { EquipmentController } from '../src/modules/equipment/equipment.controller'

describe('EquipmentController', () => {
  let controller: EquipmentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentController],
    }).compile()

    controller = module.get<EquipmentController>(EquipmentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
