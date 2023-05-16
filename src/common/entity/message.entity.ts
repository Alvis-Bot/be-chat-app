import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Conversation} from "./conversation.entity";
import {AuditEntity} from "./audit.entity";
import {MessageSubType, MessageType} from "../enum/message-type.enum";

@Entity('messages')
export class Message extends AuditEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({
        type: 'enum',
        enum: MessageType,
        default: MessageType.MSG,
    })
    type: MessageType;

    @Column({
        type: 'enum',
        enum: MessageSubType,
        default: MessageSubType.TEXT,
    })
    subtype: MessageSubType;

    @Column("text", { array: true  , nullable: true})
    img?: string[];


    @ManyToOne(() => User, user => user.messages)
    author: User;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    @JoinColumn()
    conversation: Conversation;
}