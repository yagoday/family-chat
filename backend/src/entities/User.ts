import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, MinLength, IsBoolean } from 'class-validator';
import { Message } from "./Message";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsString()
  @MinLength(3)
  username: string;

  @Column()
  @IsString()
  @MinLength(6)
  password: string;

  @Column()
  @IsString()
  @MinLength(6)
  nickname: string;

  get avatar(): string {
    return `/images/${this.username}.jpeg`;
  }

  @Column({ default: false })
  @IsBoolean()
  isOnline: boolean;

  @Column({ default: false })
  @IsBoolean()
  isAdmin: boolean;

  @OneToMany(() => Message, message => message.sender)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 