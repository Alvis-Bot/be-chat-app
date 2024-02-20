import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Routers } from '../common/enum/routers.enum';
import { Services } from '../common/enum/services.enum';
import { IMessageService } from './service/messages';
import { CreateMessageDto } from '../common/dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { AuthUser } from '../auth/decorator/user.decorator';
import { User } from '../common/entity/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiFiles } from '../users/decorator/api-file.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiException } from '../exception/api.exception';
import { ErrorCode } from '../exception/error.code';
import {DeleteMessageDto} from "../common/dto/delete-message.dto";
import {Pagination} from "../common/pagination/pagination.dto";

@Controller(Routers.MESSAGES)
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messagesService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(@AuthUser() user: User, @Body() dto: CreateMessageDto) {
    const response = await this.messagesService.createMessage(user, dto);
    this.eventEmitter.emit('message.created', response);
  }

  @Get()
  async getMessagesFromConversation(
    @AuthUser() user: User,
    @Query('id', ParseIntPipe) id: number,
    @Query() pagination: Pagination,
  ) {
    console.log('getMessagesFromConversation');
    const messages= await this.messagesService.getMessages(id , pagination);
    return { id, messages  };
  }

  @Post('img')
  @ApiFiles('files', true, 20, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
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
  })
  async uploadImage(
    @AuthUser() user: User,
    @Body() dto: CreateMessageDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const response = await this.messagesService.createMessage(
      user,
      dto,
      images,
    );
    this.eventEmitter.emit('message.created', response);
  }

  @Delete('')
  async deleteMessageFromConversation(
      @AuthUser() user: User,
      @Body() dto : DeleteMessageDto
  ) {
    const params = { userId: user.id, conversationId : dto.conversationId, messageId : dto.messageId };
    await this.messagesService.deleteMessage(user.id , dto);
    this.eventEmitter.emit('message.delete', params);
    return { conversationId : dto.conversationId, messageId : dto.messageId };
  }

}
