import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {MessageGateway} from "../gateway/message.gateway";
import {FriendRequest} from "../common/entity/friend-request.entity";
import {IMessageService} from "../messages/service/messages";
import {ServerEvent} from "../common/enum/server-event.enum";
import {AcceptFriendRequestResponse, RemoveFriendEventPayload} from "../common/type";

@Injectable()
export class FriendEvents {
    constructor(private readonly gateway : MessageGateway) {}

    @OnEvent(ServerEvent.FRIEND_REMOVED)
    handleFriendRemoved({ userId, friend }: RemoveFriendEventPayload) {
        const { sender, receiver } = friend;
        console.log(ServerEvent.FRIEND_REMOVED);
        const recipient = this.gateway.sessions.getUserSocket(
            receiver.id === userId ? sender.id : receiver.id,
        );
        recipient && this.gateway.server.to(recipient).emit('onFriendRemoved', friend);
    }


}