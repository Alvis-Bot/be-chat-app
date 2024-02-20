import {Inject, Injectable} from '@nestjs/common';
import {IGroupsService} from "./groups";
import {User} from "../../common/entity/user.entity";
import {CreateGroupDto} from "../../common/dto/create-group.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Services} from "../../common/enum/services.enum";
import {IUsersService} from "../../users/users.inteface";

@Injectable()
export class GroupsService implements IGroupsService {

    constructor(
        @Inject(Services.USERS)
        private readonly usersService: IUsersService,
    ) {}

    async createGroup(creator:User, dto:CreateGroupDto) {
      return;
    }

    getGroups(userId: number): Promise<any[]> {
        return;
    }

}
