import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './service/groups.service';
import {Services} from "../common/enum/services.enum";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Group} from "../common/entity/group.entity";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Group]),
      UsersModule,

  ],
  controllers: [GroupsController],
  providers: [{
    provide: Services.GROUPS,
    useClass: GroupsService,
  }]
})
export class GroupsModule {}
