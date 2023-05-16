import {User} from "../../common/entity/user.entity";
import {CreateGroupDto} from "../../common/dto/create-group.dto";

export interface IGroupsService {
    createGroup(creator : User , dto : CreateGroupDto): Promise<any>

    getGroups(userId: number): Promise<any[]>
}