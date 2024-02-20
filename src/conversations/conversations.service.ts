import {Inject, Injectable} from '@nestjs/common';
import {Services} from '../common/enum/services.enum';
import {InjectRepository} from "@nestjs/typeorm";
import {Conversation} from "../common/entity/conversation.entity";
import {Repository} from "typeorm";
import {IConversationService} from "./conversations.interface";
import {User} from "../common/entity/user.entity";
import {IUsersService} from "../users/users.inteface";
import {ApiException} from "../exception/api.exception";
import {ErrorCode} from "../exception/error.code";
import {Message} from "../common/entity/message.entity";
import {CreateConversationDto} from "../common/dto/create-conversation.dto";
import {IFriendsService} from "../friends/service/friend";


@Injectable()
export class ConversationsService implements IConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.FRIENDS) private readonly friendsService : IFriendsService,
    // @Inject(Services.PARTICIPANT) private participantService: IParticipantService,
    @Inject(Services.USERS) private readonly usersService: IUsersService,
  ) {}

    async findById(id: number) {
        return this.conversationRepository.findOne({
            where: { id },
            relations: [
                'creator',
                'recipient',
                'lastMessage',
            ],
        });
    }

    async isCreated(userId: number, recipientId: number) {
        return this.conversationRepository.findOne({
            where: [
                {
                    creator: { id: userId },
                    recipient: { id: recipientId },
                },
                {
                    creator: { id: recipientId },
                    recipient: { id: userId },
                },
            ],
        });
    }
  async createConversation(creator: User,  dto: CreateConversationDto): Promise<Conversation> {
      const { email} = dto
      const recipient = await this.usersService.findUser(email);
      if (!recipient) throw new ApiException(ErrorCode.USER_NOT_FOUND);
      if (creator.id === recipient.id)
          throw new ApiException(ErrorCode.CANT_CREATE_CONVERSATION_WITH_YOURSELF);
      const isFriends = await this.friendsService.isFriends(
          creator.id,
          recipient.id,
      );
      if (!isFriends) throw new ApiException(ErrorCode.FRIEND_NOT_FOUND);
      const exists = await this.isCreated(creator.id, recipient.id);
      if (exists) throw new ApiException(ErrorCode.CONVERSATION_ALREADY_EXISTS);
      const newConversation = this.conversationRepository.create({
          creator,
          recipient,
      });
      return await this.conversationRepository.save(
          newConversation,
      );


  }


   // private async createParticipantAndSaveUser(id : number , user: User) {
   //     const participant = await this.participantService.createParticipant({
   //         id: id,
   //     });
   //     // user.participant = participant;
   //     await this.usersService.saveUser(user);
   //     return participant;
   // }

    // async find(id : number): Promise<Conversation[]> {
    //     return this.participantService.findParticipantConversations(id);
    // }

    async findConversationById(id : number): Promise<Conversation> {
      console.log('id', id);
        return this.conversationRepository.findOne({
            where : {
                id : id,
            },
            relations : ['creator' , 'recipient' ,'messages' , 'messages.author'],
        });
    }

    async find(id: number): Promise<Conversation[]> {
        return this.conversationRepository.
        createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.creator', 'creator')
            .leftJoinAndSelect('conversation.lastMessage', 'lastMessage')
            .addSelect([
                'creator.id',
                'creator.firstName',
                'creator.lastName',
                'creator.email',
            ])
            .leftJoinAndSelect('conversation.recipient', 'recipient')
            .addSelect([
                'recipient.id',
                'recipient.firstName',
                'recipient.lastName',
                'recipient.email',
            ])
            .where('creator.id = :id OR recipient.id = :id', { id })
            .orderBy('conversation.id', 'DESC')
            .getMany();
    }

    async getConversations(id: number): Promise<Conversation[]> {
        return this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.lastMessage', 'lastMessage')
            .leftJoinAndSelect('conversation.creator', 'creator')
            .leftJoinAndSelect('conversation.recipient', 'recipient')
            .where('creator.id = :id OR recipient.id = :id', { id })
            .orderBy('conversation.updatedAt', 'DESC')
            .getMany();
    }




}
