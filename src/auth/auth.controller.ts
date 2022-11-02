import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
// import { UserObj } from '../decorators/user-obj.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async phoneRegister(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.login(req, res);
  }
  //
  // @Get('/logout')
  // @UseGuards(AuthGuard('jwt'))
  // async logout(@UserObj() user: User, @Res() res: Response) {
  //   return this.authService.logout(user, res);
  // }
}
