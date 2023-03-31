import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    date: Date;

    @Column()
    public: boolean;

    @ManyToOne(type => User, user => user.createdEvents)
    creator: User;

    @ManyToMany(type => User, user => user.events)
    attendees: User[];

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    constructor() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    static create(name: string, description: string, date: Date, _public: boolean, creator: User) {
        const event = new Event();

        event.name = name;
        event.description = description;
        event.date = date;
        event.public = _public;
        event.creator = creator;

        return event;
    }
}