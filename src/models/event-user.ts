import { Column, Entity, Unique, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";

export enum EventUserStatus {
    GOING = 'going',
    MAYBE = 'maybe',
    NOT_GOING = 'not_going',
}

@Entity()
@Unique(['user', 'event'])
export class EventUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: EventUserStatus,
    })
    status: EventUserStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => User, user => user.attendingEvents)
    user: User;

    @ManyToOne(type => Event, event => event.attendees)
    event: Event;

    static create(user: User | { id: number }, event: Event | { id: number }, status: EventUserStatus) {
        const eventUser = new EventUser();

        eventUser.user = user as User;
        eventUser.event = event as Event;
        eventUser.status = status;

        return eventUser;
    }
}
