import {Inject, Injectable} from '@nestjs/common';
import { IMessageService } from './messages';
import { Message } from '../../common/entity/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../../common/entity/conversation.entity';
import { ApiException } from '../../exception/api.exception';
import { ErrorCode } from '../../exception/error.code';
import {Services} from "../../common/enum/services.enum";
import {IConversationService} from "../../conversations/conversations.interface";
import {User} from "../../common/entity/user.entity";
import {CreateMessageDto} from "../../common/dto/create-message.dto";
import {DeleteMessageDto} from "../../common/dto/delete-message.dto";
import {Pagination} from "../../common/pagination/pagination.dto";
import {Meta} from "../../common/pagination/meta.dto";
import {PaginationModel} from "../../common/pagination/pagination.model";
import {TestService} from "../../test/test.service";

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.CONVERSATIONS) private conversationService: IConversationService,
  ) {}

  async createMessage(user: User, dto: CreateMessageDto, images?: Express.Multer.File[]): Promise<{
    message: any;
    conversation: any
  }> {
    const conversation = await this.conversationService.findById(dto.id);

    console.log('conversation', images);
    const { creator, recipient } = conversation;

    if (!conversation) throw new ApiException(ErrorCode.CONVERSATION_NOT_FOUND);
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new ApiException(ErrorCode.NOT_CREATE_MESSAGE);
    const message = this.messageRepository.create({
      conversation,
      subtype: dto.subtype,
      content: dto.content,
      img: images ? images.map((image) => image.filename) : null,
      author: user,
    });

    const saveMessage = await this.messageRepository.save(message);
    conversation.lastMessage = saveMessage;
    await this.conversationRepository.save(conversation);
    const updated = await this.conversationRepository.save(conversation);
    return { message: saveMessage, conversation: updated };
  }

  async getMessages(id: number, pagination: Pagination):  Promise<PaginationModel<Message>>{
    const queryBuilder = this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.author', 'author')
        .leftJoinAndSelect('message.conversation', 'conversation')
        .where('conversation.id = :id', { id })
        .take(pagination.take)
        .skip(pagination.skip)
        .orderBy('message.createdAt', 'DESC');

    const itemCount = await queryBuilder.getCount();
    const { entities } = await  queryBuilder.getRawAndEntities();
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel<Message>(entities, meta);

  }

  async deleteMessage(id: number, dto: DeleteMessageDto): Promise<void> {
    const message = await this.messageRepository.findOne({
        where: { id : dto.messageId },
    });
    if (!message) throw new ApiException(ErrorCode.MESSAGE_NOT_FOUND);
    if (message.author.id !== id)
      throw new ApiException(ErrorCode.NOT_DELETE_MESSAGE);
    await this.messageRepository.delete(id);
  }
}
