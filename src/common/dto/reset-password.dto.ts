import { IsEmail, IsNotEmpty, IsString, NotEquals } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/*
*
* @IsEmail() - email validation
* @IsNotEmpty() - not empty validation
* @IsString() - string validation
* @ApiProperty() - swagger property
* @ApiPropertyOptional() - swagger optional property
* chú ý :
* 1. Xắp xếp theo thứ tự : @IsString() @IsNotEmpty() @IsEmail()
* 2. @ApiProperty() - @ApiPropertyOptional() phải đặt cuối cùng
*
* */

export class ResetPasswordDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  passwordConfirm: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
   token : string;



}