import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto{
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;


    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @ApiProperty({ type: "string", format: "binary" })
    avatar: Express.Multer.File;






}