import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";

enum EventUserStatus {
    GOING,
    MAYBE,
    NOT_GOING,
}

@Entity()
@Index(['user', 'event'], { unique: true })
export class EventUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: EventUserStatus,
    })
    status: EventUserStatus;

    @Column()
    public: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => User, user => user.events)
    user: User;

    @ManyToOne(type => Event, event => event.attendees)
    event: Event;

    static create(user: User | { id: number }, event: Event | { id: number }, status: EventUserStatus, _public: boolean) {
        const eventUser = new EventUser();

        eventUser.user = user as User;
        eventUser.event = event as Event;
        eventUser.status = status;
        eventUser.public = _public;

        return eventUser;
    }
}
