import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Inject, Injectable} from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../../common/interface/auth";
import { UsersService } from "../../users/users.service";
import { AuthService } from "../service/auth.service";
import {User} from "../../common/entity/user.entity";
import {Services} from "../../common/enum/services.enum";
import {IUsersService} from "../../users/users.inteface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService,
              @Inject(Services.USERS) private readonly usersService: IUsersService,
              private readonly authService: AuthService) {
    super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get('JWT_SECRET'),
      });
  }

  async validate(payload: JwtPayload) : Promise<User> {
      console.log(payload);
    return  await this.authService.validateJwt(payload);
  }
}