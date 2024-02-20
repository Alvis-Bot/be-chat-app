import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {TestService} from "./test.service";
import {TestDto} from "../common/dto/test.dto";
import {ApiTags} from "@nestjs/swagger";

@Controller('test')
@ApiTags('test')
export class TestController {

    constructor(private testService : TestService) {}


    @Post('/test')
    async test( @Body() data: TestDto) {
        return await this.testService.test(data);
    }

    @Get('/test')
    async test2(@Query('id') id : number) {
        return await this.testService.getTestById(id);
    }



}
