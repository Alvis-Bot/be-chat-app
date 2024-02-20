import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './common/config/validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from './mail/mail.module';
import { GatewayModule } from './gateway/gateway.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import {EventEmitterModule} from "@nestjs/event-emitter";
import { FriendsModule } from './friends/friends.module';
import { FriendsRequestModule } from './friends-request/friends-request.module';
import { EventsModule } from './events/events.module';
import { ProfileModule } from './profile/profile.module';
import { GroupsModule } from './groups/groups.module';
import { TestModule } from './test/test.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService : ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    AuthModule,
    UsersModule,
    MailModule,
    GatewayModule,
    ConversationsModule,
    MessagesModule,
    FriendsModule,
    FriendsRequestModule,
    EventsModule,
    ProfileModule,
    GroupsModule,
    TestModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
