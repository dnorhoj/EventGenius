import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from './user';
import { EventUser, EventUserStatus } from './event-user';
import { db } from '../database';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    uuid: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
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

    /**
     * Creates a query builder and populates attendeeCount, organizer
     * @param [checkPublic=true] Whether to only select public events
     * @param [checkFuture=true] Whether to check if event is in future
     */
    static cardSelectBuilder(checkPublic: boolean = true, checkFuture: boolean = true) {
        const query = db.getRepository(Event)
            .createQueryBuilder("event")
            // Count amount of users that responded with "going"
            .loadRelationCountAndMap("event.attendeeCount", "event.attendees", "attendeeCount", qb => qb.where("status = :status", { status: EventUserStatus.GOING }))
            .leftJoinAndSelect("event.organizer", "organizer")
            .groupBy("event.id")
            .addGroupBy("organizer.id")
            .orderBy("event.date", "DESC");

        if (checkPublic) {
            query.andWhere("event.public = true");
        }
        
        if (checkFuture) {
            query.andWhere("event.date > :date", { date: new Date() });
        }

        return query;
    }
}