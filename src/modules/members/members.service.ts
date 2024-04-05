import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { MemberRepository } from './members.repository'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Member } from '../../database/entities/Member.entity'
import { CreateMemberDto } from './dto/create-member.dto'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { DataSource } from 'typeorm'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
@Injectable()
export class MemberService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MemberRepository) private memberRepository: MemberRepository
  ) {}

  async findAllMembers(paginationRequestDto: PaginationRequestDto): Promise<PaginatedMemberResult> {
    try {
      return this.memberRepository.findAllMembers({
        limit: paginationRequestDto.limit,
        page: paginationRequestDto.page,
      })
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateFetchingError('members'))
    }
  }

  async addMember(createMemberDto: CreateMemberDto) {
    try {
      return this.memberRepository.createAndSave(createMemberDto)
    } catch (err) {
      throw new InternalServerErrorException('Error adding member.')
    }
  }

  async findByIdOrThrow(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id)
    if (!member) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
    }
    return member
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
    try {
      return await this.memberRepository.updateMember(id, updateMemberDto)
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('member'))
    }
  }

  async deleteMember(id: string): Promise<void> {
    if (!(await this.findByIdOrThrow(id)))
      throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
    return await this.memberRepository.deleteMember(id)
  }
}
