import {CreateConversationDto} from "../common/dto/create-conversation.dto";
import {Conversation} from "../common/entity/conversation.entity";
import {CreateConversationParams} from "../common/type";
import {User} from "../common/entity/user.entity";

export interface IConversationService {
    createConversation(user: User, dto: CreateConversationDto): Promise<Conversation>;
    find(id : number): Promise<Conversation[]>;
    findConversationById(id : number): Promise<Conversation>;
    findById(id: number): Promise<Conversation>;
    getConversations(id: number): Promise<Conversation[]>;
}