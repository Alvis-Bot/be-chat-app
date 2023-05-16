import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";


@Entity("profiles")
export class Profile{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default : ""})
    about?: string;

    @Column({ nullable: true })
    avatar?: string;

    @OneToOne(() => User)
    user: User;


}