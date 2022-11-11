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

interface OptionsData {
  dateInformation?: boolean;
  personalData?: boolean;
}

@Injectable()
export class UserService {
  constructor(private configService: ConfigService) {}

  private filter(
    user: UserData,
    options: OptionsData | false = false,
  ): UserResponse {
    const { id, username, name, surname, email, createdAt, updatedAt } = user;
    let filterUserDataObject: UserResponse = {
      id,
      username,
    };

    if (!options) return filterUserDataObject;

    if (options.personalData) {
      filterUserDataObject = {
        ...filterUserDataObject,
        email,
        ...(name ? { name } : {}),
        ...(surname ? { surname } : {}),
      };
    }

    if (options.dateInformation) {
      filterUserDataObject = {
        ...filterUserDataObject,
        ...(createdAt ? { createdAt } : {}),
        ...(updatedAt ? { updatedAt } : {}),
      };
    }
    return filterUserDataObject;
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
    return this.filter(user, { personalData: true });
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
    return this.filter(user);
  }
  // //@TODO SET ONLY FOR ADMIN
  // async update(id: string, body: UpdateUserDto) {
  //   const user = await User.findOneBy({ id });
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   const updatedUser = await this.updateUserData(body, user);
  //   return this.filter(updatedUser);
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getCurrentUser(user: User) {
    return this.filter(user, { personalData: true, dateInformation: true });
  }

  async updateCurrentUser(user: User, body: UpdateUserDto) {
    const updatedUser = await this.updateUserData(body, user);
    return this.filter(updatedUser, {
      personalData: true,
      dateInformation: true,
    });
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
  private async updateUserData(body: UpdateUserDto, user: User): Promise<User> {
    const { password, username, email, name, surname } = body;

    if (!(await compare(password, user.hashedPassword))) {
      throw new ConflictException('Invalid password');
    }
    await this.checkConflictData(name ?? '', username ?? '');
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.name = name ?? user.name;
    user.surname = surname ?? user.surname;
    user.updatedAt = new Date();
    await user.save();
    return user;
  }
}
