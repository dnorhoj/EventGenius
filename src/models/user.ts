import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Event } from './event';
import { EventUser } from './event-user';
import { Follow } from './follow';
import { File } from "./file";
import { db } from '../database';
import { randomUUID } from 'crypto';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    bio: string | null;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(type => Follow, follow => follow.follower)
    following: Follow[];

    @OneToMany(type => Follow, follow => follow.following)
    followers: Follow[];

    @OneToMany(type => EventUser, event => event.user)
    attendingEvents: EventUser[];

    @OneToMany(type => Event, event => event.organizer)
    createdEvents: Event[];

    @ManyToOne(type => File)
    profilePicture: File | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    emailVerified: boolean = false;

    @Column({ type: 'text', unique: true, nullable: true })
    emailVerificationToken: string | null;

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

        user.emailVerificationToken = randomUUID();

        return user;
    }

    async getFollowerCount() {
        if (this.followers) {
            return this.followers.length;
        }

        // If the followers property is not set, we need to fetch it from the database
        return await db.getRepository(Follow).count({
            where: {
                following: { id: this.id }
            }
        })
    }

    async getFollowingCount() {
        if (this.following) {
            return this.following.length;
        }

        // If the following property is not set, we need to fetch it from the database
        return await db.getRepository(Follow).count({
            where: {
                follower: { id: this.id }
            }
        })
    }

    getPfpUrl() {
        if (this.profilePicture) {
            return `/cdn/${this.profilePicture.identifier}`;
        }

        return "/images/no-pfp.png";
    }
}
