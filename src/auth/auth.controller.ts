import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request } from 'express'
import { JwtAuthGuard } from './guards/jwt.guard'
import { CreateMemberDto } from '/Users/aleksa/Desktop/Projects/gym-backend/src/modules/members/dto/create-member.dto'
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createMemberDto: CreateMemberDto) {
    try {
      const newMember = await this.authService.signup(createMemberDto)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newMember
      return result
    } catch (err) {
      console.log(err)
      throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST)
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log('Inside authcontroller status method')
    console.log(req.user)
  }
}
