import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class PasswordReset {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User)
    user: User;

    @Column()
    token: string;

    @Column()
    expires: Date;

    @Column({ default: false })
    used: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}