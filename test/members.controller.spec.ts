import { Test, TestingModule } from '@nestjs/testing'
import { MembersController } from '../src/database/members/members.controller'

describe('MembersController', () => {
  let controller: MembersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
    }).compile()

    controller = module.get<MembersController>(MembersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
