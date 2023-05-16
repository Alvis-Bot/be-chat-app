import {IsNotEmpty} from "class-validator";

export class CreateFriendDto{
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    description: string;
}