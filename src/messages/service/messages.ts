import {Message} from "../../common/entity/message.entity";
import {User} from "../../common/entity/user.entity";
import {CreateMessageDto} from "../../common/dto/create-message.dto";
import {DeleteMessageDto} from "../../common/dto/delete-message.dto";
import {Pagination} from "../../common/pagination/pagination.dto";
import {PaginationModel} from "../../common/pagination/pagination.model";

export interface IMessageService {
    createMessage(user: User, dto: CreateMessageDto, images?: Express.Multer.File[]): Promise<{
        message: any;
        conversation: any
    }>;

    getMessages(id: number, skip: Pagination):  Promise<PaginationModel<Message>>;

    deleteMessage(id: number, dto: DeleteMessageDto): Promise<void>;
}