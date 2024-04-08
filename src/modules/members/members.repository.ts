import { Repository, DataSource, UpdateResult, DeleteResult } from 'typeorm'
import { Member } from '../../database/entities/Member.entity'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Injectable } from '@nestjs/common'
import { CreateMemberDto } from './dto/create-member.dto'
import { calculateOffset } from '../../database/databaseUtil/utilFunctions'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { memberAlias } from '../../database/databaseUtil/aliases'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(private dataSource: DataSource) {
    super(Member, dataSource.createEntityManager())
  }
  async createAndSave(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.create(createMemberDto)
    return await this.save(newMember)
  }

  async findAllMembers(
    paginationRequest: PaginationRequestDto
  ): Promise<PaginatedResultDto<Member>> {
    const { limit, page } = paginationRequest
    const offset = calculateOffset(limit, page)

    const queryBuilder = this.createQueryBuilder(memberAlias).skip(offset).limit(limit)

    const [members, count] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(count / limit)
    return { data: members, limit, page, count, totalPages }
  }

  async findById(id: string): Promise<Member> {
    return this.findOneBy({ id })
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<UpdateResult> {
    return this.update(id, updateMemberDto)
  }

  async deleteMember(id: string): Promise<DeleteResult> {
    return this.delete(id)
  }
}
