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
import { UserObj } from '../decorators/user.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from '../guards/roles.guard';
import { DeleteUserDto } from './dto/delete-user.dto';

@UseGuards(RolesGuard)
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
  updateCurrentUser(@UserObj() user: User, @Body() body: UpdateUserDto) {
    return this.userService.updateCurrentUser(user, body);
  }

  @Post('/register')
  register(@Body() body: RegisterUserDto) {
    return this.userService.register(body);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  // @Patch('/:id')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles(UserRoleEnum.Admin)
  // update(@Param('id', new ParseUUIDPipe()) id: string, @UserObj() user: User) {
  //   // console.log(user);
  //   return 'test';
  // }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', new ParseUUIDPipe()) id: string, body: DeleteUserDto) {
    return this.userService.remove(id, body);
  }
}
