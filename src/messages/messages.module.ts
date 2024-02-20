import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './service/messages.service';
import {Services} from "../common/enum/services.enum";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "../common/entity/message.entity";
import {Conversation} from "../common/entity/conversation.entity";
import {ConversationsModule} from "../conversations/conversations.module";
import {TestModule} from "../test/test.module";
import {TestService} from "../test/test.service";

@Module({
  imports: [
      // TestModule,
      ConversationsModule,
      TypeOrmModule.forFeature([Message , Conversation]),
  ],
  controllers: [MessagesController],
  providers: [{
    provide: Services.MESSAGES,
    useClass: MessagesService
  }]
})
export class MessagesModule {}
