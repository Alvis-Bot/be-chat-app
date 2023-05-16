import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from "../service/auth.service";
import {UsersService} from "../../users/users.service";
import {Services} from "../../common/enum/services.enum";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(username , password)
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}