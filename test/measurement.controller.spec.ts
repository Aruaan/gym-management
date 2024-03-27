import { Test, TestingModule } from '@nestjs/testing'
import { MeasurementController } from '../src/modules/measurements/measurement.controller'

describe('MeasurementController', () => {
  let controller: MeasurementController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementController],
    }).compile()

    controller = module.get<MeasurementController>(MeasurementController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
