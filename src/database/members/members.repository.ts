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

@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(private dataSource: DataSource) {
    super(Member, dataSource.createEntityManager())
  }
  async createAndSave(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.create(createMemberDto)

    try {
      await this.save(newMember)
      return newMember
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Member with that email already exists')
      } else {
        throw new InternalServerErrorException('Error saving the member')
      }
    }
  }

  async findAll(limit: number, offset: number): Promise<[Member[], number]> {
    const [members, total] = await Promise.all([
      this.createQueryBuilder('member').skip(offset).take(limit).getMany(),
      this.createQueryBuilder('member').getCount(),
    ])

    return [members, total]
  }
  async findById(id: string): Promise<Member> {
    const member = await this.findOne({ where: { id } })
    if (!member) throw new NotFoundException('Member not found')
    return member
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findById(id)
    const updated = Object.assign(member, updateMemberDto)

    try {
      await this.save(updated)
      return updated
    } catch (error) {
      throw new InternalServerErrorException('Error updating member')
    }
  }

  async deleteMember(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException('Member not found')
    }
  }
}
