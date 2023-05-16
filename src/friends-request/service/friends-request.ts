import {CreateFriendDto} from "../../common/dto/create-friend.dto";
import {User} from "../../common/entity/user.entity";
import {FriendRequest} from "../../common/entity/friend-request.entity";
import {Friend} from "../../common/entity/friend.entity";

export interface IFriendRequestService {
    create(user: User , dto : CreateFriendDto): Promise<FriendRequest>;
    getFriendRequests(userId: number): Promise<FriendRequest[]>;
    isPending(userOneId: number, userTwoId: number);
    findById(id: number): Promise<FriendRequest>;

    accept(userId: number, id: number): Promise<{ friend: Friend; friendRequest: FriendRequest }>;
    cancel(userId: number, id: number): Promise<FriendRequest>;
    reject(userId: number, id: number): Promise<FriendRequest>;
}