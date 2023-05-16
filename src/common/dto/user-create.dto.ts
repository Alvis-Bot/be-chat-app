import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserCreateDto{

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName : string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName : string

  @IsEmail()
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