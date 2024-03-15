import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common'
import { MembersService } from './members.service'
import { ApiOperation, ApiQuery } from '@nestjs/swagger'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { CreateMemberDto } from './dto/create-member.dto'
import { Member } from '../entities/Member.entity'

@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiOperation({
    summary: 'Find All Members',
    description:
      'Retrieves a list of members with pagination. You can specify the number of results to return (limit) and an offset for pagination.',
  })
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0
  ): Promise<PaginatedMemberResult> {
    if (limit < 0 || offset < 0) {
      throw new BadRequestException('Limit and offset must be greater than or equal to 0')
    }

    return this.memberService.findAllMembers(limit, offset).catch(() => {
      throw new HttpException('Error fetching members', HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }

  @ApiOperation({
    summary: 'Add New Member',
    description:
      'Creates a new member with the provided details. Returns data of the newly added member.',
  })
  @Post()
  async addMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.addMember(createMemberDto)
  }
}
