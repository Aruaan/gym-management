import { Test, TestingModule } from '@nestjs/testing'
import { ExerciseController } from '../src/database/exercises/exercises.controller'

describe('ExercisesController', () => {
  let controller: ExerciseController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseController],
    }).compile()

    controller = module.get<ExerciseController>(ExerciseController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
