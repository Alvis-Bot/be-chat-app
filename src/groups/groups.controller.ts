import {Body, Controller, Get, Inject, Post, UseGuards} from '@nestjs/common';
import {AuthUser} from "../auth/decorator/user.decorator";
import {User} from "../common/entity/user.entity";
import {EventEmitter2} from "@nestjs/event-emitter";
import {IGroupsService} from "./service/groups";
import {Services} from "../common/enum/services.enum";
import {CreateGroupDto} from "../common/dto/create-group.dto";
import {JwtAuthGuard} from "../auth/guard/jwt.guard";

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {

    constructor(
        @Inject(Services.GROUPS) private readonly groupsService: IGroupsService,
        private eventEmitter: EventEmitter2,
    ) {}

    @Post()
    async createGroup(@AuthUser() user: User, @Body() dto: CreateGroupDto) {
        const group = await this.groupsService.createGroup(user , dto);
        this.eventEmitter.emit('group.create', group);
        return group;
    }

    @Get()
    getGroups(@AuthUser() { id }: User) {
        return this.groupsService.getGroups(id);
    }

}
