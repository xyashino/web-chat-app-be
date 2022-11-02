import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
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
    const { id, username, name, surname } = user;
    return {
      id,
      username,
      ...(name ? { name } : {}),
      ...(surname ? { surname } : {}),
    };
  }

  async register(body: RegisterUserDto): Promise<UserResponse> {
    const { username, email, password, surname, name } = body;

    await this.checkConflictData(email, username);

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

  async findOne(userId: string) {
    const user = await User.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    const { id, username, email, createdAt, updatedAt, role, name, surname } =
      user;
    return {
      id,
      username,
      email,
      ...(name ? { name } : {}),
      ...(surname ? { surname } : {}),
      role,
      createdAt,
      ...(updatedAt ? { updatedAt } : {}),
    };
  }

  async update(id: string, body: UpdateUserDto) {
    const user = await User.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    const { password, username, email, name, surname } = body;

    if (!(await compare(password, user.hashedPassword))) {
      //@TODO change error
      throw new ConflictException();
    }
    await this.checkConflictData(name ?? '', username ?? '');
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.name = name ?? user.name;
    user.surname = surname ?? user.surname;
    user.updatedAt = new Date();
    await user.save();
    return this.filter(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async checkConflictData(
    email: string,
    username: string,
  ): Promise<void> {
    const userExist: UserData | null =
      (await User.findOneBy({ email })) ?? (await User.findOneBy({ username }));
    if (userExist)
      throw new ConflictException(
        `${userExist.email === email ? 'Email' : 'Username'} is taken`,
      );
  }
}
