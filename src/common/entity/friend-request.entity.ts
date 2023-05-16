import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {FriendRequestStatus} from "../enum/friend-request.enum";
import {User} from "./user.entity";
import {AuditEntity} from "./audit.entity";


@Entity({ name: 'friend_requests' })
export class FriendRequest extends AuditEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    sender: User;

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    receiver: User;

    @Column( )
    description: string;

    @Column()
    status: FriendRequestStatus;
}