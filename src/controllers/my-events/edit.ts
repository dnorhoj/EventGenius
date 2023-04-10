import { RequestHandler } from "express";
import { Event } from "../../models/event";
import { db } from "../../database";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect("/login");
    }

    const eventId = req.params.id;

    const event = await db.getRepository(Event).findOne({
        where: {
            uuid: eventId,
            organizer: { id: res.locals.user.id }
        }
    });

    if (!event) {
        return res.status(404).render("error/404");
    }

    // Render create/update page with the event data
    res.render("my-events/create", { event: {
        ...event,
        // Whether to check the no location checkbox
        noLocation: !event.location
    } });
}