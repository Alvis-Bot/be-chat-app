import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({ name: 'tests' })
export class Testssss {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}