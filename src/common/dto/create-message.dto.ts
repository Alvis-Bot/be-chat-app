import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {MessageSubType} from "../enum/message-type.enum";

export class CreateMessageDto{

    @IsString()
    content: string;

    @IsNotEmpty()
    id: number;

    @IsEnum(MessageSubType)
    subtype: MessageSubType;

    files?: Express.Multer.File[];
}