import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Testssss} from "../common/entity/test.enity";
import {Repository} from "typeorm";
import {TestDto} from "../common/dto/test.dto";

@Injectable()
export class TestService {

    constructor(@InjectRepository(Testssss) private testRepository: Repository<Testssss>) {
    }


    async test(dto : TestDto) {
        const test = this.testRepository.create(dto);
        return await this.testRepository.save(test);
    }

    async getTestById(id: number) {
        return await this.testRepository
            .createQueryBuilder('test')
            .getMany();
    }
}
