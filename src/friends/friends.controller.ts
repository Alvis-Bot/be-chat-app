import {Controller, Delete, Get, Inject, Param, ParseIntPipe, Query, UseGuards} from '@nestjs/common';
import {Services} from "../common/enum/services.enum";
import {IFriendsService} from "./service/friend";
import {Routers} from "../common/enum/routers.enum";
import {AuthUser} from "../auth/decorator/user.decorator";
import {User} from "../common/entity/user.entity";
import {JwtAuthGuard} from "../auth/guard/jwt.guard";
import {EventEmitter2} from "@nestjs/event-emitter";
import {ServerEvent} from "../common/enum/server-event.enum";

@Controller(Routers.FRIENDS)
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(
        @Inject(Services.FRIENDS) private readonly friendsService: IFriendsService,
        private readonly event: EventEmitter2,
    ) {}

    @Get()
    async getFriends(@AuthUser() user: User) {
        console.log('Fetching Friends');
        return await this.friendsService.getFriends(user.id);
    }

    @Delete()
    async deleteFriend(
        @AuthUser() { id: userId }: User,
        @Query('id', ParseIntPipe) id: number,
    ) {
        const friend = await this.friendsService.deleteFriend( id, userId );
        this.event.emit(ServerEvent.FRIEND_REMOVED, { friend, userId });
        return friend;
    }
}
