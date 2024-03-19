import { Module } from '@nestjs/common'
import { MembersController } from './members.controller'
import { MembersService } from './members.service'
import { MemberRepository } from './members.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from '../entities/Member.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MembersService, MemberRepository],
})
export class MembersModule {}
