/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthPayloadDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { MemberRepository } from '/Users/aleksa/Desktop/Projects/gym-backend/src/modules/members/members.repository'
import * as bcrypt from 'bcrypt'
import { CreateMemberDto } from 'src/modules/members/dto/create-member.dto'
import { Member } from 'src/database/entities/Member.entity'
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository) private memberRepository: MemberRepository,
    private jwtService: JwtService
  ) {}

  async signup(createMemberDto: CreateMemberDto): Promise<Member> {
    const { email, password, ...memberData } = createMemberDto

    const existingMember = await this.memberRepository.findOne({ where: { email } })
    if (existingMember) {
      throw new ConflictException('Email address already in use')
    }

    const newMember = this.memberRepository.create({ ...memberData, email, password })
    console.log(newMember)
    try {
      return await this.memberRepository.save(newMember)
    } catch (error) {
      throw new InternalServerErrorException('Error saving new member')
    }
  }

  async validateUser({ email, password: memberPassword }: AuthPayloadDto) {
    const member = await this.memberRepository.findOne({ where: { email } })
    if (!member || !(await bcrypt.compare(memberPassword, member.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const { password, ...result } = member
    return result
  }

  async login(member: Member) {
    const payload = {
      email: member.email,
      sub: {
        firstName: member.firstName,
        lastName: member.lastName,
      },
    }

    return {
      ...member,
      accessToken: this.jwtService.sign(payload),
    }
  }
}
