import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class DeleteUserDto extends PartialType(UpdateUserDto) {
  @IsNotEmpty()
  @IsString()
  @Length(8, 256)
  password: string;
}
