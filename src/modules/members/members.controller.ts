import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common'
import { MemberService } from './members.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateMemberDto } from './dto/create-member.dto'
import { Member } from '../../database/entities/Member.entity'
import { PaginationRequestDto } from '../universaldtos/pagination-request.dto'
import { UpdateMemberDto } from './dto/update-member.dto'
import { PaginatedResultDto } from '../universaldtos/paginated-result.dto'
@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiOperation({
    summary: 'Find All Members',
    description:
      'Retrieves a list of members with pagination. You can specify the number of results to return (limit) and an offset for pagination.',
  })
  async findAll(
    @Query() paginationRequest: PaginationRequestDto
  ): Promise<PaginatedResultDto<Member>> {
    return this.memberService.findAllMembers(paginationRequest)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find Member By Id',
    description:
      'Returns a member by ID. Returns "Not Found" if member with that ID does not exist.',
  })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const member = this.memberService.findByIdOrThrow(id)
    return member
  }

  @Post()
  @ApiOperation({
    summary: 'Add New Member',
    description:
      'Creates a new member with the provided details. Returns data of the newly added member.',
  })
  async addMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.addMember(createMemberDto)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update Existing Member',
    description:
      'Updates the details of a member specified by their ID using the provided data.Returns "Not Found" if member with that ID does not exist.',
  })
  async updateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto
  ): Promise<void> {
    this.memberService.updateMember(id, updateMemberDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete An Existing Member',
    description:
      'Deletes a member by ID. If successful return status 204, otherwise a not found exception.',
  })
  async deleteMember(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.memberService.deleteMember(id)
  }
}
