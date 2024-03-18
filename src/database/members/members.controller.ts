import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common'
import { MembersService } from './members.service'
import { ApiOperation } from '@nestjs/swagger'
import { PaginatedMemberResult } from './dto/paginated-member.dto'
import { CreateMemberDto } from './dto/create-member.dto'
import { Member } from '../entities/Member.entity'
import { PaginationRequestDto } from './dto/pagionation-request.dto'
import { errorMessages } from '../databaseUtil/utilFunctions'
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Members',
    description:
      'Retrieves a list of members with pagination. You can specify the number of results to return (limit) and an offset for pagination.',
  })
  async findAll(@Query() paginationRequest: PaginationRequestDto): Promise<PaginatedMemberResult> {
    return this.memberService.findAllMembers(paginationRequest).catch(() => {
      throw new HttpException(
        errorMessages.generateFetchingError('members'),
        HttpStatus.INTERNAL_SERVER_ERROR
      )
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
