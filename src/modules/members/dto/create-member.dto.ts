import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateMemberDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  firstName: string

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  lastName: string

  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email: string

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  password: string
}
