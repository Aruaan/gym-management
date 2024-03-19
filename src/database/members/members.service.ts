import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { MemberRepository } from './members.repository'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Member } from '../entities/Member.entity'
import { CreateMemberDto } from './dto/create-member.dto'
import { PaginationRequestDto } from './dto/pagination-request.dto'
import { errorMessages } from '../databaseUtil/utilFunctions'
@Injectable()
export class MemberService {
  constructor(@InjectRepository(MemberRepository) private memberRepository: MemberRepository) {}

  async findAllMembers(paginationRequestDto: PaginationRequestDto): Promise<PaginatedMemberResult> {
    try {
      const { limit, offset } = paginationRequestDto
      const [members, total] = await this.memberRepository.findAll(paginationRequestDto)
      const totalPages = Math.ceil(total / limit)
      return { data: members, limit, offset, total, totalPages }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('members'))
    }
  }

  async addMember(createMemberDto: CreateMemberDto) {
    try {
      const newMember = this.memberRepository.create(createMemberDto)
      return await this.memberRepository.save(newMember)
    } catch (error) {
      throw new InternalServerErrorException('Error adding member')
    }
  }

  async findById(id: string): Promise<Member> {
    return await this.memberRepository.findById(id)
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const allowedUpdateFields = ['firstName', 'lastName', 'email']
    Object.keys(updateMemberDto).forEach((key) => {
      if (!allowedUpdateFields.includes(key)) {
        throw new BadRequestException(`Invalid field name ${key}`)
      }
    })
    return await this.memberRepository.updateMember(id, updateMemberDto)
  }

  async deleteMember(id: string): Promise<void> {
    return await this.memberRepository.deleteMember(id)
  }
}
