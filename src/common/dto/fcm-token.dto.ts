import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FcmTokenDto {
  @IsString()
  @IsOptional()
  @Length(1, 1000)
  @ApiPropertyOptional({
    description: 'fcm token firebase cloud messaging (không bắt buộc)',
    example: 'fcm token',
  })
  fcmToken: String;
}