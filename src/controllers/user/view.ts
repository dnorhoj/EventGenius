import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { db } from '../../database';
import { Event } from '../../models/event';
import { EventUserStatus } from '../../models/event-user';

export const get: RequestHandler = async (req, res) => {
    const username = req.params.username;

    const user = await db.getRepository(User).findOne({
        where: { username },
        relations: { profilePicture: true }
    });

    if (!user) {
        return res.status(404).render('error/404');
    }

    // Check if user is following
    const isFollowing = await db.getRepository(Follow).exist({
        where: {
            follower: { id: res.locals.user.id },
            following: { id: user.id }
        }
    });

    // User's follower and following counts
    const userFollowers = await user.getFollowerCount();
    const userFollowing = await user.getFollowingCount();

    // Get overview events
    const attendingEvents = await Event.cardSelectBuilder()
        .innerJoin('event.attendees', 'attendee')
        .andWhere('attendee.userId = :userId', { userId: user.id })
        .andWhere('attendee.status = :status', { status: EventUserStatus.GOING })
        .limit(5)
        .getMany();

    const userEvents = await Event.cardSelectBuilder()
        .andWhere("organizer.id = :organizerId", { organizerId: user.id })
        .limit(5)
        .getMany();

    res.render('user/view', { 
        targetUser: user,
        isFollowing,
        userFollowers, userFollowing,
        attendingEvents, userEvents,
    });
}
