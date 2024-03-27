import { Module } from '@nestjs/common'
import { MembersController } from './members.controller'
import { MemberService } from './members.service'
import { MemberRepository } from './members.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from '../../database/entities/Member.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MemberService, MemberRepository],
})
export class MemberModule {}
