import { IsEmail, IsEnum, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsEnum(['local', 'google'])
  type: string;

  @IsString()
  password: string;
}
