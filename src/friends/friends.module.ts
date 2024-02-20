import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './service/friends.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Friend} from "../common/entity/friend.entity";
import {Services} from "../common/enum/services.enum";

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  controllers: [FriendsController],
  providers: [{
    provide: Services.FRIENDS,
    useClass: FriendsService
  }],
    exports: [Services.FRIENDS]
})
export class FriendsModule {}
