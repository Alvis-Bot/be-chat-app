import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../common/entity/user.entity';
import { UserCreateDto } from '../common/dto/user-create.dto';
import { ApiException } from '../exception/api.exception';
import { ErrorCode } from '../exception/error.code';
import { JwtPayload } from '../common/interface/auth';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { VerityDto } from '../common/dto/verity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {MongoRepository, MoreThan, ObjectId, Repository} from 'typeorm';
import {IUsersService} from "./users.inteface";
import {UpdateUserDto} from "../common/dto/update-user.dto";

@Injectable()
export class UsersService implements IUsersService{
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}



    async findUserById(id : string): Promise<User> {
        return this.userRepository.
        createQueryBuilder('user')
            .where('user.id = :id', { id })
            .getOne();
    }

  async getUserByEmail(email: string): Promise<User> {
    return  this.userRepository.findOne({ where: { email } });
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

    async findUser(email : string): Promise<User> {
        return this.userRepository.findOne({
            where: {
               email: email
            },
        })
    }


  async getUserByPasswordResetToken(
    hashedToken: string,
  ): Promise<User> {
    return this.userRepository.findOne({
        where: {
            passwordResetToken: hashedToken ,
            passwordResetExpress: MoreThan(new Date())
        },
    });
  }

    async getProfile(id: number) : Promise<User> {
        return this.userRepository.findOne({
            where: {
                id
            }
        })
    }

    async updateProfile(id: number, dto: UpdateUserDto, file: Express.Multer.File) {
        return this.userRepository.update(id, {...dto , avatar : file?.filename});
    }

     async updateUserOnline(userId: number, isOnline: boolean): Promise<void> {
         await this.userRepository.update( userId, { isOnline });
    }
}
