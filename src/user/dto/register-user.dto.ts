import { UserData } from '../../types/interfaces/user/user-data';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

type UserRegistration = Omit<
  UserData,
  'id' | 'hashedPassword' | 'createdAt' | 'updatedAt'
> & {
  password: UserData['hashedPassword'];
};

export class RegisterUserDto implements UserRegistration {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  username: string;
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
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
