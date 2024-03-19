import { Repository, DataSource } from 'typeorm'
import { Member } from '../entities/Member.entity'
import { UpdateMemberDto } from './dto/update-member.dto'
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateMemberDto } from './dto/create-member.dto'
import { PaginationRequestDto } from './dto/pagionation-request.dto'
import { errorMessages } from '../databaseUtil/utilFunctions'
@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(private dataSource: DataSource) {
    super(Member, dataSource.createEntityManager())
  }
  async createAndSave(createMemberDto: CreateMemberDto): Promise<Member> {
    const existingMember = await this.findOne({ where: { email: createMemberDto.email } })

    if (existingMember) {
      throw new ConflictException('Member with that email already exists.')
    }

    const newMember = this.create(createMemberDto)
    return await this.save(newMember)
  }

  async findAll(paginationRequest: PaginationRequestDto): Promise<[Member[], number]> {
    const { limit, offset } = paginationRequest

    const [members, total] = await Promise.all([
      this.find({ skip: offset, take: limit }),
      this.count(),
    ])

    return [members, total]
  }

  async findById(id: string): Promise<Member> {
    const member = await this.findOne({ where: { id } })
    if (!member) throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
    return member
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findById(id)
    const updated = Object.assign(member, updateMemberDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException(errorMessages.generateUpdateFailed('member'))
    }
  }

  async deleteMember(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(errorMessages.generateEntityNotFound('Member'))
    }
  }
}
