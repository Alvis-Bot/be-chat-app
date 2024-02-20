import {Inject, Injectable} from '@nestjs/common';
import {IFriendRequestService} from "./friends-request";
import {User} from "../../common/entity/user.entity";
import {CreateFriendDto} from "../../common/dto/create-friend.dto";
import {FriendRequest} from "../../common/entity/friend-request.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Friend} from "../../common/entity/friend.entity";
import {Services} from "../../common/enum/services.enum";
import {Repository} from "typeorm";
import {IFriendsService} from "../../friends/service/friend";
import {UsersService} from "../../users/users.service";
import {ApiException} from "../../exception/api.exception";
import {ErrorCode} from "../../exception/error.code";
import {FriendRequestStatus} from "../../common/enum/friend-request.enum";

@Injectable()
export class FriendsRequestService implements IFriendRequestService{

    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        @InjectRepository(FriendRequest)
        private readonly friendRequestRepository: Repository<FriendRequest>,
        @Inject(Services.USERS)
        private readonly userService: UsersService,
        @Inject(Services.FRIENDS)
        private readonly friendsService: IFriendsService,
    ) {}
    async create(sender: User, dto: CreateFriendDto): Promise<FriendRequest> {
        const receiver = await this.userService.findUser(dto.email);
        if (!receiver) throw new ApiException(ErrorCode.USER_NOT_FOUND);
        const exists = await this.isPending(sender.id, receiver.id);
        if (exists) throw new ApiException(ErrorCode.FRIEND_REQUEST_ALREADY_EXISTS);
        if (receiver.id === sender.id)
            throw new ApiException(ErrorCode.CANT_SEND_FRIEND_REQUEST_TO_YOURSELF);
        const isFriends = await this.friendsService.isFriends(
            sender.id,
            receiver.id,
        );
        if (isFriends) throw new ApiException(ErrorCode.ALREADY_FRIENDS);
        const friend = this.friendRequestRepository.create({
            sender,
            receiver,
            description: dto.description,
            status: FriendRequestStatus.PENDING,
        });
        return this.friendRequestRepository.save(friend);
    }

    async findById(id: number): Promise<FriendRequest> {
        return this.friendRequestRepository.findOne({
            where: {
                id
            },
            relations: ['sender' , 'receiver']
        });
    }

    async getFriendRequests(userId: number): Promise<FriendRequest[]> {

        return this.friendRequestRepository.find({
            where: [
                {
                    sender: { id: userId },
                    status: FriendRequestStatus.PENDING,
                },
                {
                    receiver: { id: userId },
                    status: FriendRequestStatus.PENDING,
                }
            ],
            relations: ['receiver', 'sender'],
        });
    }

    async isPending(userOneId: number, userTwoId: number) {
        return  this.friendRequestRepository.findOne({
            where: [
                {
                    sender: { id: userOneId },
                    receiver: { id: userTwoId },
                    status: FriendRequestStatus.PENDING,
                },
                {
                    sender: { id: userTwoId },
                    receiver: { id: userOneId },
                    status: FriendRequestStatus.PENDING,
                },
            ],
        });
    }

   async accept(userId: number, id: number): Promise<{ friend: Friend; friendRequest: FriendRequest }> {
       const friendRequest = await this.findById(id);
       if (!friendRequest) throw new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
       if (friendRequest.status === FriendRequestStatus.ACCEPTED)
           throw new ApiException(ErrorCode.FRIEND_REQUEST_ALREADY_ACCEPTED);
       if (friendRequest.receiver.id !== userId)
           throw new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
       friendRequest.status = FriendRequestStatus.ACCEPTED;
       const updatedFriendRequest = await this.friendRequestRepository.save(
           friendRequest,
       );
       const newFriend = this.friendRepository.create({
           sender: friendRequest.sender,
           receiver: friendRequest.receiver,
       });
       const friend = await this.friendRepository.save(newFriend);
       return { friend, friendRequest: updatedFriendRequest };
    }

    async cancel(userId: number, id: number): Promise<FriendRequest> {
        const friendRequest = await this.findById(id);
        if (!friendRequest) throw new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
        if (friendRequest.sender.id !== userId) throw new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
        await this.friendRequestRepository.delete(id);
        return friendRequest;
    }

    async reject(userId: number, id: number): Promise<FriendRequest> {
        const friendRequest = await this.findById(id);
        if (!friendRequest) throw new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
        if (friendRequest.status === FriendRequestStatus.ACCEPTED)
            throw new ApiException(ErrorCode.FRIEND_REQUEST_ALREADY_ACCEPTED);
        if (friendRequest.receiver.id !== userId)
            throw new ApiException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
        friendRequest.status = FriendRequestStatus.REJECTED;
        return this.friendRequestRepository.save(friendRequest);
    }


}
