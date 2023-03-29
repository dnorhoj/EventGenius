import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Event } from './event';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(type => Event, event => event.attendees)
    @JoinTable()
    events: Event[];

    @Column()
    isOrganizer: boolean;

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
}
