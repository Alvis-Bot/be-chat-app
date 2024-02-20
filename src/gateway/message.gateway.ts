import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { from, map, Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../common/entity/user.entity';
import { Model, Types } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthenticatedSocket } from '../common/inteface';
import { Services } from '../common/enum/services.enum';
import { GatewaySessionManager } from './gateway.session';
import { Message } from '../common/entity/message.entity';
import { Conversation } from '../common/entity/conversation.entity';
import { CreateMessageResponse } from '../common/type';
import { IFriendsService } from '../friends/service/friend';
import {Group} from "../common/entity/group.entity";
import {IUsersService} from "../users/users.inteface";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements  OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessageGateway');
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: GatewaySessionManager,
    @Inject(Services.FRIENDS) private readonly friendsService: IFriendsService,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
  ) {}

  @SubscribeMessage('create.message')
  async createMessage(@MessageBody() data: any): Promise<any> {
    console.log('create.message', data);
  }

  @SubscribeMessage('getOnlineFriends')
  async onFriendListRetrieve(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<any> {
    const friends = await this.friendsService.getFriends(client.user.sub);
    const onlineFriends = friends.filter((friend) =>
      this.sessions.getUserSocket(
        client.user.sub === friend.receiver.id
          ? friend.sender.id
          : friend.receiver.id,
      ),
    );
    console.log('onlineFriends', onlineFriends.length);
    client.emit('getOnlineFriends', onlineFriends);
  }

  @OnEvent('message.created')
  async onMessageCreated(payload: CreateMessageResponse) {
    console.log('Inside message.create');
    const {
      author,
      conversation: { creator, recipient },
    } = payload.message;

    //get all author socket

    const authorSocket = this.sessions.getUserSocket(author.id);
    const recipientSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);

    if (authorSocket) {
      console.log('authorSocket' ,authorSocket);
      this.server.to(authorSocket).emit('onMessage', payload);
    }
    if (recipientSocket) this.server.to(recipientSocket).emit('onMessage', payload);
  }


  @OnEvent('group.create')
  handleGroupCreate(payload: Group) {
    console.log('group.create event');
    payload.users.forEach((user) => {
      const socket = this.sessions.getUserSocket(user.id);
      socket && this.server.to(socket).emit('onGroupCreate', payload);
    });
  }



  async handleConnection(
    client: AuthenticatedSocket,
    ...args: any[]
  ): Promise<void> {
    this.sessions.setUserSocketId(client.user.sub, client.id);
    this.server.emit('connected', { status: 'good' });
    const sockets = this.sessions.getUserSocket(client.user.sub);
    sockets.length > 0 &&   await this.usersService.updateUserOnline(client.user.sub, true);

  }


  @SubscribeMessage('onOnline')
    async onOnline(@MessageBody() data: any, @ConnectedSocket() client: AuthenticatedSocket): Promise<any> {
        const sockets = this.sessions.getUserSocket(client.user.sub);
        sockets.length > 0 &&   await this.usersService.updateUserOnline(client.user.sub, true);
  }


   async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    this.logger.log(client.id, 'Disconnect');
    this.sessions.removeSocketId(client.user.sub , client.id);
    const sockets = this.sessions.getUserSocket(client.user.sub);
    if (sockets.length === 0) {
      this.sessions.removeUserSocketId(client.user.sub);
      await this.usersService.updateUserOnline(client.user.sub, false);
    }
  }

  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: Conversation) {
    console.log('Inside conversation.create');
    const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);
    if (recipientSocket) this.server.to(recipientSocket).emit('onConversation', payload);
  }
}
