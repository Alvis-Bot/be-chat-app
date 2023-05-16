import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./user.entity";
import {Message} from "./message.entity";
import {AuditEntity} from "./audit.entity";

@Entity('conversation')
// @Index(['creator.id', 'recipient.id'], { unique: true })
export class Conversation extends AuditEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User , { createForeignKeyConstraints: false })
    @JoinColumn()
    creator: User;

    @OneToOne(() => User , { createForeignKeyConstraints: false , })
    @JoinColumn()
    recipient: User;

    @OneToMany(() => Message, message => message.conversation)
    @JoinColumn()
    messages: Message[];

    @OneToOne(() => Message)
    @JoinColumn()
    lastMessage: Message;

}