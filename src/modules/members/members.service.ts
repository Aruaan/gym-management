import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { MemberRepository } from './members.repository'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateMemberDto } from './dto/update-member.dto'
import { Member } from '../../database/entities/Member.entity'
import { CreateMemberDto } from './dto/create-member.dto'
import { PaginationRequestDto } from './dto/pagination-request.dto'
import {
  calculateOffset,
  errorMessages,
} from '/Users/aleksa/Desktop/Projects/gym-backend/src/database/databaseUtil/utilFunctions'
import { Meal } from '../../database/entities/Meal.entity'
import { DataSource } from 'typeorm'
@Injectable()
export class MemberService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(MemberRepository) private memberRepository: MemberRepository
  ) {}

  async findAllMembers(paginationRequestDto: PaginationRequestDto): Promise<PaginatedMemberResult> {
    try {
      const { limit, page } = paginationRequestDto
      const offset = calculateOffset(limit, page)
      const [members, total] = await this.memberRepository.findAll({ skip: offset, take: limit })
      const totalPages = Math.ceil(total / limit)
      return { data: members, limit, offset, total, totalPages }
    } catch (error) {
      console.error(error)
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

  async findByIdOrThrow(id: string): Promise<Member> {
    return await this.memberRepository.findByIdOrThrow(id)
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

  async addMemberAndUpdateMeal(createMemberDto: CreateMemberDto, mealId: string): Promise<Meal> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const newMember = await queryRunner.manager.save(
        this.memberRepository.create(createMemberDto)
      )

      const meal = await queryRunner.manager.findOne(Meal, { where: { id: mealId } })
      if (!meal) {
        throw new NotFoundException(`Meal with ID ${mealId} not found`)
      }
      meal.member = newMember
      await queryRunner.manager.save(meal)

      await queryRunner.commitTransaction()
      return meal
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
