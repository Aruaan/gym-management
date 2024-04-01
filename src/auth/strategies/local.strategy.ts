import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(email: string, password: string) {
    try {
      const member = this.authService.validateUser({ email, password })
      if (!member) throw new UnauthorizedException()
      return member
    } catch (err) {
      throw new UnauthorizedException(err.message)
    }
  }
}
