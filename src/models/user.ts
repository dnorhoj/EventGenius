import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Event } from './event';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(type => Event, event => event.attendees)
    @JoinTable()
    events: Event[];

    @OneToMany(type => Event, event => event.creator)
    createdEvents: Event[];

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    constructor() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    static create(
        username: string,
        email: string,
        password: string,
    ) {
        const user = new User();

        user.username = username;
        user.email = email;
        user.password = password;

        return user;
    }
}
