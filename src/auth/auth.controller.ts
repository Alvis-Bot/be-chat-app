import {Body, Controller, Get, Inject, Post, Req, Res, UseGuards} from '@nestjs/common';
import { FcmTokenDto } from '../common/dto/fcm-token.dto';
import { AuthService } from './service/auth.service';
import { UsersService } from '../users/users.service';
import { AuthUser } from './decorator/user.decorator';

import {ResetPasswordDto} from "../common/dto/reset-password.dto";
import { CustomerInfoDto } from "../common/dto/customer-info.dto";
import { Routers } from "../common/enum/routers.enum";
import { ApiTags } from "@nestjs/swagger";
import {ForgotPasswordDto} from "../common/dto/forgot-password.dto";
import {VerityDto} from "../common/dto/verity.dto";
import {UserCreateDto} from "../common/dto/user-create.dto";
import {LocalAuthGuard} from "./guard/local.guard";
import {User} from "../common/entity/user.entity";
import {JwtAuthGuard} from "./guard/jwt.guard";
import {LoginDto} from "../common/dto/login.dto";
import {Services} from "../common/enum/services.enum";
import {IAuthService} from "./service/auth";

@Controller(Routers.AUTH)
@ApiTags('Auth')
export class AuthController {
  constructor(
     private readonly authService: AuthService,
  ) {}


  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login (@AuthUser() user: User , @Body() dto: LoginDto) {
    return  await this.authService.login(user)
  }


  @Post('register')
  async register(@Body() dto: UserCreateDto): Promise<void> {
    await this.authService.createUser(dto);
  }

  // @Get('status')
  // @UseGuards(JwtAuthGuard)
  //   async status(@AuthUser() user: User) {
  //       return await this.authService.status(user);
  // }

  @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
      return await this.authService.resetPassword(dto);
  }

    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
      return await this.authService.forgotPassword(dto);
    }
  //vietvodinh12547@gmail.com
  @Post('verify')
  async verify(@Body() dto: VerityDto) {
    return await this.authService.verifyOTP(dto);
  }
  // @UseGuards(JwtAuthGuard)
  // @Get('info')
  //   async info(@AuthUser() user : UserDocument) {
  //       return await this.authService.info(user);
  //}



}
