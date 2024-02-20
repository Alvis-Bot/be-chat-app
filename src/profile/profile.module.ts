import { Module } from '@nestjs/common';
import { ProfileService } from './service/profile.service';
import { ProfileController } from './profile.controller';
import {Services} from "../common/enum/services.enum";

@Module({
  providers: [{
    provide: Services.PROFILE,
    useClass: ProfileService
  }],
  controllers: [ProfileController],
  exports: [Services.PROFILE]
})
export class ProfileModule {}
