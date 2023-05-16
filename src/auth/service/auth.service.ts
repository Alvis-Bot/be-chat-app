import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../common/interface/auth';
import { User } from '../../common/entity/user.entity';
import {
  addMinutes, correctOTP,
  correctPassword, createOTP,
  createPasswordResetToken,
  hashToken, randomOTP,
} from '../../common/util/code.util';
import { ApiException } from '../../exception/api.exception';
import { ErrorCode } from '../../exception/error.code';
import { ResetPasswordDto } from '../../common/dto/reset-password.dto';
import { ForgotPasswordDto } from '../../common/dto/forgot-password.dto';
import { MailService } from '../../mail/mail.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { resetPasswordTemplate } from '../../mail/templates/reset-password';
import { VerityDto } from '../../common/dto/verity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDto } from '../../common/dto/user-create.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {MongoRepository, MoreThan, Repository} from 'typeorm';
import { verifyEmailTemplate } from '../../mail/templates/verify-email';
import { TokenModel } from '../../common/model/token.model';
import { Services } from '../../common/enum/services.enum';
import { IUsersService } from '../../users/users.inteface';
import { IAuthService } from './auth';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) {}

  async login(user: User) {
    const payload: JwtPayload = { username: user.email, sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        }),
    ]);
    return new TokenModel(accessToken, refreshToken);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const myUser = await this.usersService.getUserByEmail(username);
    if (!myUser) throw new UnauthorizedException();
    const isCorrectPassword = await correctPassword(password, myUser.password);
    console.log(isCorrectPassword);
    if (isCorrectPassword) return myUser;
    return null;
  }

  async validateJwt(payload: JwtPayload): Promise<User> {
    const myUser = await this.usersService.getUserByEmail(payload.username);
    if (!myUser) throw new UnauthorizedException();
    return myUser;
  }

  async refresh(user: User) : Promise<TokenModel> {
    const payload: JwtPayload = { username: user.email, sub: user.id };
    return new TokenModel(await this.jwtService.signAsync(payload));
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    //1. check user exist
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) throw new ApiException(ErrorCode.USER_NOT_FOUND);
    // Generate the random reset token
    const { hashedToken, expires, resetToken } = createPasswordResetToken();
    user.passwordResetExpress = expires;
    user.passwordResetToken = await hashedToken;
    await this.userRepository.save(user);
    // 3) Send it to user's email
    try {
      const RESET_PASSWORD_URL = `${this.configService.get(
        'FRONTEND_URL',
      )}/auth/new-password?token=${resetToken}`;

      console.log(this.configService.get<boolean>('ENABLE_SEND_EMAIL'));

      if (this.configService.get('ENABLE_SEND_EMAIL') == "true") {
        console.log('send email');
        await this.mailService.sendMail({
          to: user.email,
          from: this.configService.get<string>('EMAIL_FROM'),
          subject: 'Reset password',
          html: resetPasswordTemplate(user.firstName, RESET_PASSWORD_URL),
          attachments: [],
        });
      }
    } catch (e) {
      user.passwordResetToken = undefined;
      user.passwordResetExpress = undefined;
      await this.userRepository.save(user);
      throw new ApiException(ErrorCode.EMAIL_NOT_SEND);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    // 2) If token has not expired, and there is user, set the new password
    const hashedToken: string = await hashToken(dto.token);
    const user = await this.usersService.getUserByPasswordResetToken(
      hashedToken,
    );

    // 2) If token has not expired, and there is user, set the new password
    if (!user) throw new ApiException(ErrorCode.TOKEN_INVALID_OR_EXPIRED);
    user.password = dto.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpress = undefined;
    await this.userRepository.save(user);

    console.log(await this.login(user));


    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const payload: JwtPayload = { username: user.email, sub: user.id };
    return new TokenModel(await this.jwtService.signAsync(payload));
  }

  // async sendOTP(userId: string): Promise<void> {}
  //
  async verifyOTP(dto: VerityDto): Promise<TokenModel> {
    console.log(await createOTP(dto.otp));
    const user = await this.userRepository.findOne({
          where: {
            email: dto.email,
            otp: dto.otp,
            otpExpires: MoreThan(new Date()),
          },
    });
    if (!user) throw new UnauthorizedException('OTP is invalid.');

    user.otp = null;
    user.verified = true;
    await this.userRepository.save(user);
    const payload: JwtPayload = { username: user.email, sub: user.id };
    return new TokenModel(await this.jwtService.signAsync(payload));
  }

  private async createBaseUser(dto: UserCreateDto): Promise<User> {
    const user = new User();
    user.email = dto.email;
    user.password = dto.password;
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.otp = randomOTP();
    user.otpExpires = addMinutes(new Date(), 10);
    return await this.userRepository.save(user);
  }

  async createUser(dto: UserCreateDto): Promise<void> {
    // check inf email user exist
    const userExists = await this.usersService.getUserByEmail(dto.email);
    if (userExists)
      throw new ApiException(
        ErrorCode.USER_ALREADY_EXIST,
        'Email is already in use. Please login.',
      );
    // create base user
    const user = await this.createBaseUser(dto);

    // TODO Send mail
    if (this.configService.get<string>('ENABLE_SEND_EMAIL') === "true") {
      try {
        await this.mailService.sendMail({
          to: user.email,
          from: this.configService.get<string>('EMAIL_FROM'),
          subject: 'Verify email',
          html: verifyEmailTemplate(user.firstName, user.otp),
          attachments: [],
        });
      } catch (e) {
        throw new ApiException(ErrorCode.EMAIL_NOT_SEND);
      }
    }
  }

  async status(user: User) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.participant', 'participant')
      .where('user.id = :id', { id: user.id })
      .getOne();
  }
}
