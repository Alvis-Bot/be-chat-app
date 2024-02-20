import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import {Services} from "../common/enum/services.enum";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Conversation} from "../common/entity/conversation.entity";
import {UsersModule} from "../users/users.module";
import {ConversationsService} from "./conversations.service";
import {Message} from "../common/entity/message.entity";
import {FriendsModule} from "../friends/friends.module";

@Module({
  imports: [
      UsersModule,
      FriendsModule,
      TypeOrmModule.forFeature([Conversation , Message]),
  ],
  providers: [
    {
        provide: Services.CONVERSATIONS,
        useClass: ConversationsService,
    }
  ],
  exports: [
      Services.CONVERSATIONS
  ],
  controllers: [ConversationsController]
})
export class ConversationsModule {}
