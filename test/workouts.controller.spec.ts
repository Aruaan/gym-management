import { Test, TestingModule } from '@nestjs/testing'
import { WorkoutsController } from 'src/database/workouts/workouts.'

describe('WorkoutsController', () => {
  let controller: WorkoutsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
    }).compile()

    controller = module.get<WorkoutsController>(WorkoutsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
