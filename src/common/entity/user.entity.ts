import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {Exclude} from "class-transformer";
import * as mongoose from 'mongoose';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn, ManyToMany, ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import * as bcrypt from 'bcrypt';
import {Message} from "./message.entity";
import {AuditEntity} from "./audit.entity";
import {Profile} from "./profile.entity";
import {Group} from "./group.entity";
import {Conversation} from "./conversation.entity";
@Entity({ name: 'users' })
export class User extends AuditEntity{

  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true })
  // username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default : ""})
  avatar: string;

  @Column()
  @Exclude()
  password: string;


  @Column({ nullable: true })
  @Exclude()
  otp: string;

  @Column({ nullable: true })
  @Exclude()
  otpExpires: Date;

    @Column({ default: false })
    verified: boolean;

  @Column({ nullable: true })
  passwordResetToken : string

  @Column({ nullable: true })
  passwordResetExpress : Date

  @Column({ default: false })
  isOnline: boolean;


  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];


  @OneToMany(() => Message, message => message.author)
    messages: Message[];

  @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;


  @BeforeInsert()
    emailToLowerCase() {
        if (this.email)
        this.email = this.email.toLowerCase();
  }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
         if (this.password)
           this.password = await bcrypt.hash(this.password, 12);
    }



}