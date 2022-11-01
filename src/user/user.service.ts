import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserData } from '../types/interfaces/user/user-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private configService: ConfigService) {}
  async register(body: RegisterUserDto) {
    const { username, email, password, surname, name } = body;
    const userExist: UserData | null =
      (await User.findOneBy({ email })) ?? (await User.findOneBy({ username }));
    if (userExist) {
      const existValue = userExist.email === email ? 'email' : 'username';
      throw new ConflictException(`User with this ${existValue} exist`);
    }
    const user = new User();
    user.username = username;
    user.email = email;
    user.hashedPassword = await hash(
      password,
      +this.configService.get<number>('ROUNDS_SALT'),
    );
    user.name = name ?? null;
    user.surname = surname ?? null;
    await user.save();
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
