import { Test, TestingModule } from '@nestjs/testing'
import { WorkoutService } from '../src/database/workouts/workouts.service'

describe('WorkoutsService', () => {
  let service: WorkoutService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutService],
    }).compile()

    service = module.get<WorkoutService>(WorkoutService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
