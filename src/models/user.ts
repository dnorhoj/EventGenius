import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Event } from './event';
import { EventUser } from './event-user';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(type => EventUser, event => event.user)
    events: EventUser[];

    @OneToMany(type => Event, event => event.organizer)
    createdEvents: Event[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    static create(
        username: string,
        name: string,
        email: string,
        password: string,
    ) {
        const user = new User();

        user.username = username;
        user.name = name;
        user.email = email;
        user.password = password;

        return user;
    }
}
