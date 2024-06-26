import { Test, TestingModule } from '@nestjs/testing'
import { ExerciseService } from '../src/database/exercises/exercises.service'

describe('ExercisesService', () => {
  let service: ExerciseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseService],
    }).compile()

    service = module.get<ExerciseService>(ExerciseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
