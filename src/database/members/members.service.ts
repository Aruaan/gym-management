import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MemberRepository } from './members.repository'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Member } from '../entities/Member.entity'
import { CreateMemberDto } from './dto/create-member.dto'
@Injectable()
export class MembersService {
  constructor(@InjectRepository(MemberRepository) private memberRepository: MemberRepository) {}
  async findAllMembers(limit: number, offset: number): Promise<PaginatedMemberResult> {
    try {
      const [members, total] = await this.memberRepository.findAll(limit, offset)
      const totalPages = Math.ceil(total / limit)
      return { data: members, limit, offset, total, totalPages }
    } catch (error) {
      throw new InternalServerErrorException('Error fetching members')
    }
  }

  async addMember(createMemberDto: CreateMemberDto) {
    try {
      const newMember = this.memberRepository.create(createMemberDto)
      return await this.memberRepository.save(newMember)
    } catch (error) {
      throw new InternalServerErrorException('Error Adding Employee')
    }
  }

  async findById(id: string): Promise<Member> {
    return await this.memberRepository.findById(id)
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    return await this.memberRepository.updateMember(id, updateMemberDto)
  }

  async deleteMember(id: string): Promise<void> {
    return await this.memberRepository.deleteMember(id)
  }
}
