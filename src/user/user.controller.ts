import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findAll();
  }

  @Get('/current')
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@UserObj() user: User) {
    return this.userService.getCurrentUser(user);
  }
  @Patch('/current')
  @UseGuards(AuthGuard('jwt'))
  updateCurrentUser(@UserObj() user: User) {
    return this.userService.updateCurrentUser(user);
  }

  @Post('/register')
  register(@Body() body: RegisterUserDto) {
    return this.userService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
