import {IsNotEmpty, IsNumber} from "class-validator";

export class DeleteMessageDto{

    @IsNotEmpty()
    @IsNumber()
    conversationId: number;

    @IsNotEmpty()
    @IsNumber()
    messageId: number;
}