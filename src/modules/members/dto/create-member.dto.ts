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
  @MaxLength(50)
  email: string
}
