import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from './user';
import { EventUser } from './event-user';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    name: string;

    @Column()
    description: string;
    
    @Column()
    location: string;

    @Column()
    date: Date;

    @Column()
    public: boolean;

    @ManyToOne(type => User, user => user.createdEvents)
    organizer: User;

    @OneToMany(type => EventUser, user => user.event)
    attendees: EventUser[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    static generateUUID() {
        return randomUUID();
    }
}