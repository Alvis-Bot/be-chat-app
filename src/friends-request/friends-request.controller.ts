import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Services } from '../common/enum/services.enum';
import { IFriendRequestService } from './service/friends-request';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../common/entity/user.entity';
import { AuthUser } from '../auth/decorator/user.decorator';
import { CreateFriendDto } from '../common/dto/create-friend.dto';
import { ServerEvent } from '../common/enum/server-event.enum';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import {AcceptFriendRequestResponse} from "../common/type";

@Controller('friends-request')
@UseGuards(JwtAuthGuard)
export class FriendsRequestController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS)
    private readonly friendRequestService: IFriendRequestService,
    private event: EventEmitter2,
  ) {}

  @Get()
  getFriendRequests(@AuthUser() user: User) {
    return this.friendRequestService.getFriendRequests(user.id);
  }

  @Post()
  async createFriendRequest(
    @AuthUser() user: User,
    @Body() dto: CreateFriendDto,
  ) {
    console.log('dto', dto);
    const friendRequest = await this.friendRequestService.create(user, dto);
    this.event.emit(ServerEvent.FRIEND_REQUEST_CREATED, friendRequest);
    return friendRequest;
  }

  @Patch('accept')
  async acceptFriendRequest(
    @AuthUser() { id: userId }: User,
    @Query('id', ParseIntPipe) id: number,
  ) : Promise<AcceptFriendRequestResponse> {
    const response = await this.friendRequestService.accept(userId, id);
    this.event.emit(ServerEvent.FRIEND_REQUEST_ACCEPTED, response);
    return response;
  }

  @Delete('cancel')
  async cancelFriendRequest(
    @AuthUser() { id: userId }: User,
    @Query('id') id: number,
  ) {
    const response = await this.friendRequestService.cancel(userId, id);
    this.event.emit(ServerEvent.FRIEND_REQUEST_CANCELED, response);
    return response;
  }

  @Patch('reject')
  async rejectFriendRequest(
    @AuthUser() { id: userId }: User,
    @Query('id') id: number,
  ) {
    console.log('id', id);
    const response = await this.friendRequestService.reject(userId, id);
    this.event.emit(ServerEvent.FRIEND_REQUEST_REJECTED, response);
    return response;
  }
}
