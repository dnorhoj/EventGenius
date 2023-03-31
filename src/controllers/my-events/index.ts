import type { RequestHandler } from "express";
import { User } from "../../models/user";
import { Event } from "../../models/event";
import { db } from "../../database";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    const user = res.locals.user as User;
    const events = await db.getRepository(Event).find({ where: { creator: user } });

    res.render('my-events/index', { events });
}