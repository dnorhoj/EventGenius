import { RequestHandler } from "express";
import { EventUser, EventUserStatus } from "../../models/event-user";
import { db } from "../../database";
import { Event } from "../../models/event";

export const post: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    // Check if response is a valid status
    if (!Object.values(EventUserStatus).includes(req.body.response)) {
        return res.redirect(`/events/${req.params.id}`);
    }

    // Get event
    const event = await db.getRepository(Event).findOne({
        where: { uuid: req.params.id }
    });

    if (!event) {
        return res.status(404).render('error/404');
    }

    // Check if user has already responded to this event
    const eventUser = await db.getRepository(EventUser).findOne({
        where: {
            event: { id: event.id },
            user: { id: res.locals.user.id }
        }
    });

    // Save response
    await db.getRepository(EventUser).save({
        id: eventUser?.id,
        event: { id: event.id },
        user: { id: res.locals.user.id },
        status: req.body.response
    });

    res.redirect(`/events/${req.params.id}`)
}