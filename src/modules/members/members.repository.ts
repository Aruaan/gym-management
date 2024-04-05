import { Repository, DataSource } from 'typeorm'
import { Member } from '../../database/entities/Member.entity'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Injectable } from '@nestjs/common'
import { CreateMemberDto } from './dto/create-member.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { memberAlias } from '../../database/databaseUtil/aliases'
@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(private dataSource: DataSource) {
    super(Member, dataSource.createEntityManager())
  }
  async createAndSave(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.create(createMemberDto)
    return await this.save(newMember)
  }

  async findAllMembers(paginationRequest: PaginationRequestDto): Promise<PaginatedMemberResult> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)
    const queryBuilder = this.createQueryBuilder(memberAlias).skip(offset).limit(limit)

    const [members, total] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(total / limit)
    return { data: members, limit, offset, total, totalPages }
  }

  async findById(id: string): Promise<Member> {
    return await this.findOneBy({ id })
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findById(id)
    const updated = Object.assign(member, updateMemberDto)

    await this.save(updated)
    return updated
  }

  async deleteMember(id: string): Promise<void> {
    await this.delete(id)
  }
}
