import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Message} from "./message.entity";
import {GroupMessage} from "./group-message.entity";
import {AuditEntity} from "./audit.entity";


@Entity('groups')
export class Group extends AuditEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    title?: string;

    @ManyToMany(() => User, (user) => user.groups)
    @JoinTable()
    users: User[];

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    creator: User;


    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    owner: User;

    @OneToMany(() => GroupMessage, (message) => message.group, {
        cascade: ['insert', 'remove', 'update'],
    })
    @JoinColumn()
    messages: GroupMessage[];

    @OneToOne(() => GroupMessage)
    @JoinColumn({ name: 'last_message_sent' })
    lastMessageSent: GroupMessage;

    @Column({ nullable: true })
    avatar?: string;
}