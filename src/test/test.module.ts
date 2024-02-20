import {Global, Module} from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Testssss} from "../common/entity/test.enity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Testssss])],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService]
})
export class TestModule {}
