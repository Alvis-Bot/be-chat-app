import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {Group} from "./group.entity";
import {BaseMessage} from "./base-message.entity";

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
    @ManyToOne(() => Group, (group) => group.messages)
    group: Group;

    // @OneToMany(() => GroupMessageAttachment, (attachment) => attachment.message)
    // @JoinColumn()
    // attachments?: MessageAttachment[];
}