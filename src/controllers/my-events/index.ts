import type { RequestHandler } from "express";
import { User } from "../../models/user";
import { Event } from "../../models/event";
import { db } from "../../database";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    const user = res.locals.user;

    // Get all user's events with the number of attendees
    const events = await db.getRepository(Event).createQueryBuilder('event')
        .leftJoin('event.organizer', 'organizer')
        .loadRelationCountAndMap('event.attendeeCount', 'event.attendees')
        .where('event.organizerId = :organizerId', { organizerId: user.id })
        .orderBy('event.date', 'ASC')
        .getMany();
    
    // Check if there are any events
    const anyEvents = events.length > 0;

    // Filter events into upcoming and past events
    const upcomingEvents = events.filter(event => event.date >= new Date());
    const pastEvents = events.filter(event => event.date < new Date());

    res.render('my-events/index', { anyEvents, upcomingEvents, pastEvents });
}