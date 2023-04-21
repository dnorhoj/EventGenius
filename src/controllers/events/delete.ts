import type { RequestHandler } from "express";
import { db } from "../../database";
import { Event } from "../../models/event";

export const post: RequestHandler = async (req, res) => {
    const event = await db.getRepository(Event).findOne({
        where: {
            uuid: req.params.id,
            organizer: { id: res.locals.user.id }
        },
        relations: { organizer: true }
    });

    if (!event) {
        return res.status(404).render('error/404');
    }

    await db.getRepository(Event).delete({
        id: event.id
    });

    res.redirect('/my-events');
}