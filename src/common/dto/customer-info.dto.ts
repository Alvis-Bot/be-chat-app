import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CustomerInfoDto{

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    email: string;

    @IsPhoneNumber("VN")
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    address: string;
}