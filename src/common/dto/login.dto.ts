import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        default: 'vietvodinh12547@gmail.com'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;

}