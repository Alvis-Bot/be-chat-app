import {IsString, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateProfileDto{
    avatar?: Express.Multer.File;
    banner?: Express.Multer.File;
}