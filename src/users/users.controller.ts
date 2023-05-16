import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post, Query,
    Req, Res,
    UploadedFile,
    UploadedFiles,
    UseGuards
} from '@nestjs/common';
import { Routers } from '../common/enum/routers.enum';
import { UsersService } from './users.service';
import { UserCreateDto } from '../common/dto/user-create.dto';
import { AuthService } from '../auth/service/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../auth/decorator/public.decorator';
import { RefreshTokenDto } from '../common/dto/refresh-token.dto';
import { LocalAuthGuard } from '../auth/guard/local.guard';
import { AuthUser } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import {LoginDto} from "../common/dto/login.dto";
import {User} from "../common/entity/user.entity";
import {VerityDto} from "../common/dto/verity.dto";
import {Services} from "../common/enum/services.enum";
import {UpdateUserDto} from "../common/dto/update-user.dto";
import {ApiFile} from "./decorator/api-file.decorator";
import {extname} from "path";
import {ApiException} from "../exception/api.exception";
import {ErrorCode} from "../exception/error.code";
import {diskStorage} from "multer";
import {Response} from "express";
@Controller(Routers.USERS)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    // private readonly authService: AuthService,
    @Inject(Services.USERS) private readonly usersService: UsersService,
  ) {}


    @Get('me')
    async getProfile(@AuthUser() user: User) {
        return await this.usersService.getProfile(user.id);
    }

    @ApiFile('avatar' ,
        true,
        {
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join("");
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req: any, file: any, cb: any) => {
                console.log(file);
                if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    // Allow storage of file
                    cb(null, true);
                } else {
                    // Reject file
                    cb(new ApiException(ErrorCode.FILE_TYPE_NOT_MATCHING), false);
                }
            },
        },)
  @Patch('profile')
  async updateProfile(@AuthUser() user: User, @Body() dto: UpdateUserDto , @UploadedFile() file : Express.Multer.File) {
        console.log(user , dto , file);
      return await this.usersService.updateProfile(user.id, dto , file);
  }
    @Public()
    @Get("image/:filename/:accessToken")
    seeUploadedFile(
        @Param("filename") image: string,
        @Param("accessToken") accessToken: string,
        @Res() res: Response,
    ) {
        // cần check lại là token và đã hết hạn
       try {
           return res.sendFile(image, { root: "./uploads" });
       }catch (e) {
           throw new ApiException(ErrorCode.IMAGE_NOT_FOUND);
       }
    }



  // @Get('refresh')
  // async refresh(@Req() req) {
  //   return await this.authService.refresh(req.user);
  // }


}
