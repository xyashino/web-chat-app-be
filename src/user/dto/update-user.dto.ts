import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsOptional()
  @IsNotEmpty()
  @Length(3, 255)
  username?: string;
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email?: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 256)
  password: string;
  @IsString()
  @IsOptional()
  surname?: string;
  @IsString()
  @IsOptional()
  name?: string;
}
