
import {Friend} from "../../common/entity/friend.entity";

export interface IFriendsService {
    getFriends(id: number): Promise<Friend[]>;
    findFriendById(id: number): Promise<Friend>;
    // deleteFriend(params: DeleteFriendRequestParams);
    isFriends(userOneId: number, userTwoId: number): Promise<Friend | undefined>;
}