import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { randomBytes } from 'crypto';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User)
    user: User;

    @Column({ unique: true })
    token: string;

    @Column()
    active: boolean = true;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    expires_at: Date;

    constructor() {
        this.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    static create(userId: number) {
        const session = new Session();

        session.token = Session.generateToken();
        session.user = { id: userId } as User;

        return session;
    }

    static generateToken() {
        return randomBytes(32).toString('base64url');
    }
}
