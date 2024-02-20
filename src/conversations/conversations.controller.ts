import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Services } from '../common/enum/services.enum';
import { IConversationService } from './conversations.interface';
import { CreateConversationDto } from '../common/dto/create-conversation.dto';
import { AuthUser } from '../auth/decorator/user.decorator';
import { User } from '../common/entity/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { IUsersService } from '../users/users.inteface';
import { Routers } from '../common/enum/routers.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routers.CONVERSATIONS)
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    private readonly events: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() dto: CreateConversationDto,
  ) {
    console.log('createConversation');
    const conversation = await this.conversationService.createConversation(
      user,
      dto,
    );
    this.events.emit('conversation.create', conversation);
    return conversation;
  }
  @Get()
  async getConversations(@AuthUser() { id }: User) {
    return this.conversationService.getConversations(id);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    return this.conversationService.findById(id);
  }
}
