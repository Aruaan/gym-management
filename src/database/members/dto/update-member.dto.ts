import { CreateMemberDto } from './create-member.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
