import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { MemberRepository } from './members.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Member } from '../../database/entities/Member.entity'
import { CreateMemberDto } from './dto/create-member.dto'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { DataSource } from 'typeorm'
import { errorMessages } from '../../database/databaseUtil/utilFunctions'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
@Injectable()
export class MemberService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MemberRepository) private memberRepository: MemberRepository
  ) {}

  async findAllMembers(
    paginationRequestDto: PaginationRequestDto
  ): Promise<PaginatedResultDto<Member>> {
    try {
      return await this.memberRepository.findAllMembers({
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

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<void> {
    try {
      const updateResult = await this.memberRepository.updateMember(id, updateMemberDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
      }
    } catch (err) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('member'))
    }
  }

  async deleteMember(id: string): Promise<void> {
    try {
      const deleteResult = await this.memberRepository.deleteMember(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateDeleteFailed('member'))
    }
  }
}
