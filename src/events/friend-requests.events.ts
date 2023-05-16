import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {MessageGateway} from "../gateway/message.gateway";
import {FriendRequest} from "../common/entity/friend-request.entity";
import {IMessageService} from "../messages/service/messages";
import {ServerEvent} from "../common/enum/server-event.enum";
import {AcceptFriendRequestResponse} from "../common/type";

@Injectable()
export class FriendRequestsEvents {
    constructor(private readonly gateway : MessageGateway) {}

    @OnEvent(ServerEvent.FRIEND_REQUEST_CREATED)
    handleFriendRequestCreateEvent(payload: FriendRequest) {
        console.log('friend_request.create', payload);
        const receiverSocket = this.gateway.sessions.getUserSocket(payload.receiver.id);
        receiverSocket &&  this.gateway.server.to(receiverSocket).emit('onFriendRequestCreated', payload);
    }

    @OnEvent(ServerEvent.FRIEND_REQUEST_CANCELED)
    handleFriendRequestCancelEvent(payload: FriendRequest) {
        console.log('friend_request.cancel', payload);
        const receiverSocket = this.gateway.sessions.getUserSocket(payload.receiver.id);
        receiverSocket &&  this.gateway.server.to(receiverSocket).emit('onFriendRequestCanceled', payload);
    }

    @OnEvent(ServerEvent.FRIEND_REQUEST_ACCEPTED)
    handleFriendRequestAcceptEvent(payload: AcceptFriendRequestResponse) {
        console.log('friend_request.accept', payload);
        const receiverSocket = this.gateway.sessions.getUserSocket(payload.friendRequest.sender.id);
        receiverSocket &&  this.gateway.server.to(receiverSocket).emit('onFriendRequestAccepted', payload);
    }

}