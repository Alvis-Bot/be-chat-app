import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../common/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Services} from "../common/enum/services.enum";
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
  ],
  providers: [{
    provide: Services.USERS,
    useClass: UsersService,
  }],
  exports: [Services.USERS],
  controllers: [UsersController],
})
export class UsersModule {}

// MongooseModule.forFeatureAsync([
//   {
//     name: User.name,
//     imports: [ConfigModule],
//     useFactory: (configService: ConfigService) => {
//       const schema = UserEntity;
//       schema.plugin(require('mongoose-autopopulate'));
//       schema.methods.createPasswordResetToken = async function () {
//         //random string
//         return  crypto.randomBytes(32).toString('hex');
//       }
//       schema.pre('save',  async function(next) {
//         if (!this.isModified("otp")) return next();
//         this.otp = await bcrypt.hash(this.otp, 12);
//       })
//       schema.pre('save',  async function(next) {
//         if (!this.isModified("password")) return next();
//         this.password = await bcrypt.hash(this.password, 12);
//       })
//       schema.methods.correctPassword = async function (
//           candidatePassword: string, // 123456
//           userPassword: string, // $2a$12
//       ) {
//         return await bcrypt.compare(candidatePassword, userPassword);
//       }
//       schema.methods.correctOTP = async function (
//           candidateOTP: string, // 123456
//           userOTP: string, // $2a$12
//       ) {
//         return await bcrypt.compare(candidateOTP, userOTP);
//       }
//       return schema;
//     },
//     inject: [ConfigService],
//   },
// ])
