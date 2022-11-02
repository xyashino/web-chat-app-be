import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { compare } from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(
      payload,
      this.configService.get<string>('SECRET_JWT'),
      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await User.findOneBy({ currentTokenId: token });
    } while (!!userWithThisToken);

    user.currentTokenId = token;
    await user.save();
    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOneBy({
        username: req.username,
      });

      const matchPwd: boolean = user
        ? await compare(req.password, user.hashedPassword)
        : false;

      if (!user || !matchPwd) {
        return res.json({ error: 'Invalid login data!' });
      }

      const token = await this.createToken(await this.generateToken(user));
      return res
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: this.configService.get<string>('DOMAIN'),
          httpOnly: true,
        })
        .json({ logged: true, status: 200 });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: User, res: Response): Promise<any> {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: this.configService.get<boolean>('PROTOCOL_SECURE'),
        domain: this.configService.get<string>('DOMAIN'),
        httpOnly: this.configService.get<boolean>('HTTP_ONLY'),
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
