import {User} from "./entity/user.entity";
import {messaging} from "firebase-admin";
import {Conversation} from "./entity/conversation.entity";
import {Message} from "./entity/message.entity";
import {Friend} from "./entity/friend.entity";
import {FriendRequest} from "./entity/friend-request.entity";

export type CreateConversationParams = {
    email: string;
    message: string;
};

export type FindParticipantParams = Partial< {
    id : number;
}>

export interface AuthenticatedRequest extends Request {
    user: User
}

export  type FindUserParams = Partial<{
    email: string;
}>


export type CreateParticipantParams = {
    id: number;
}

export type CreateMessageParams = {
    content: string;
    id: number;
    user: User;
}

export type CreateMessageResponse = {
    message: Message;
    conversation: Conversation;
};



export type AcceptFriendRequestResponse = {
    friend: Friend;
    friendRequest: FriendRequest
}



