import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../common/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewaySessionManager } from './gateway.session';
import { Services } from '../common/enum/services.enum';
import {FriendsModule} from "../friends/friends.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule , FriendsModule],
  providers: [
    MessageGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [MessageGateway ,{
    provide: Services.GATEWAY_SESSION_MANAGER,
    useClass: GatewaySessionManager,
  }],
})
export class GatewayModule {}
