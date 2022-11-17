import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 256)
  password: string;
}
