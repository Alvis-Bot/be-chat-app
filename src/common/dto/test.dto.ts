import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";


export class TestDto{


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}