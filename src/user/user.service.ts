import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserData } from '../types/interfaces/user/user-data';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from '../types/user/user-response';

@Injectable()
export class UserService {
  constructor(private configService: ConfigService) {}

  private filter(user: UserData): UserResponse {
    const { id, username, email, name, surname } = user;

    return {
      id,
      username,
      email,
      ...(name ? { name } : {}),
      ...(surname ? { surname } : {}),
    };
  }

  async register(body: RegisterUserDto): Promise<UserResponse> {
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
    return this.filter(user);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await User.find();
    return users.map((user) => this.filter(user));
  }

  findOne(id: string) {
    return User.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
