import { Injectable } from '@nestjs/common';
import {IFriendsService} from "./friend";
import {Friend} from "../../common/entity/friend.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ApiException} from "../../exception/api.exception";
import {ErrorCode} from "../../exception/error.code";

@Injectable()
export class FriendsService implements IFriendsService{
    constructor(
        @InjectRepository(Friend)
        private readonly friendsRepository: Repository<Friend>,
    ) {}
    async getFriends(id: number): Promise<Friend[]> {
         return this.friendsRepository.find({
             where: [{ sender: { id } }, { receiver: { id } }],
             relations: [
                 'sender',
                 'receiver',
                 // 'sender.profile',
                 // 'receiver.profile',
                 // 'receiver.presence',
                 // 'sender.presence',
             ],
         });
    }
    async findFriendById(id: number): Promise<any> {
        return this.friendsRepository.findOne({
            where : {
                id
            },
            relations: [
                'sender',
                'receiver',
            ],
        });
    }
    async isFriends(userOneId: number, userTwoId: number): Promise<any> {
        return this.friendsRepository.findOne({
            where: [
                {
                    sender: { id: userOneId },
                    receiver: { id: userTwoId },
                },
                {
                    sender: { id: userTwoId },
                    receiver: { id: userOneId },
                },
            ],
        });
    }

    async deleteFriend(id: number, userId: number): Promise<Friend> {
        const friend = await this.findFriendById(userId);
        if (!friend) throw new ApiException(ErrorCode.FRIEND_NOT_FOUND);
        console.log(friend);
        if (friend.receiver.id !== userId && friend.sender.id !== userId)
            throw new ApiException(ErrorCode.CANT_NOT_DELETE_FRIEND);
        await this.friendsRepository.delete(id);
        return friend;
    }
}
