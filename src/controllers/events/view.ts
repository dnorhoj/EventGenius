import { RequestHandler } from "express";
import { Event } from "../../models/event";
import { User } from "../../models/user";
import { EventUser, EventUserStatus } from "../../models/event-user";
import { db } from "../../database";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    const event = await db.getRepository(Event).findOne({
        where: { uuid: req.params.id },
        relations: {
            organizer: { profilePicture: true }
        }
    });

    if (!event) {
        return res.status(404).render('error/404');
    }

    const attendeeStatuses = await db.getRepository(EventUser).createQueryBuilder('event_user')
        .select('COUNT(*)', 'count')
        .addSelect('status')
        .where('event_user.eventId = :id', { id: event.id })
        .groupBy('status')
        .getRawMany();

    const attendeeCount: Record<EventUserStatus, string> = attendeeStatuses.reduce((map, obj) => {
        map[obj.status] = obj.count;
        return map;
    }, {
        [EventUserStatus.GOING]: '0',
        [EventUserStatus.MAYBE]: '0',
        [EventUserStatus.NOT_GOING]: '0',
    });

    // Get user's status for this event
    const eventUser = await db.getRepository(EventUser).findOne({
        where: {
            event: { id: event.id },
            user: { id: res.locals.user.id }
        }
    });

    const userStatus = eventUser?.status;

    res.render('events/view', { event, attendeeCount, userStatus });
};
