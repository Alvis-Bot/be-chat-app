import { Module } from '@nestjs/common';
import { FriendsRequestController } from './friends-request.controller';
import { FriendsRequestService } from './service/friends-request.service';
import {Services} from "../common/enum/services.enum";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FriendRequest} from "../common/entity/friend-request.entity";
import {Friend} from "../common/entity/friend.entity";
import {UsersModule} from "../users/users.module";
import {FriendsModule} from "../friends/friends.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([FriendRequest , Friend]),
      UsersModule,
      FriendsModule
  ],
  controllers: [FriendsRequestController],
  providers: [{
    provide: Services.FRIENDS_REQUESTS,
    useClass: FriendsRequestService
  }]
})
export class FriendsRequestModule {}
