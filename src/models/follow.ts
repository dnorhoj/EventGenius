
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['follower', 'following'])
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.followers)
    follower: User;

    @ManyToOne(type => User, user => user.following)
    following: User;

    static create(follower: User, following: User) {
        const follow = new Follow();
        follow.follower = follower;
        follow.following = following;
        return follow;
    }
}