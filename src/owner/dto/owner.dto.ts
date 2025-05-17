import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class createOwnerDto {
  @IsEmail()
  @MaxLength(256, { message: 'Email is more than 256 characters' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must have a minimum of 6 characters' })
  password: string;

  @IsString()
  orgName: string;
}
