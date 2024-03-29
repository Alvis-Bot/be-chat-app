import { Module } from '@nestjs/common';
import {FriendRequestsEvents} from "./friend-requests.events";
import {GatewayModule} from "../gateway/gateway.module";

@Module({
    imports: [GatewayModule],
  providers: [FriendRequestsEvents],
})
export class EventsModule {}
