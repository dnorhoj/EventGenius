import type { RequestHandler } from "express";
import { db } from "../../database";
import { Session } from "../../models/session";

export const get: RequestHandler = async (req, res) => {
    // Check if user is logged in
    if (!res.locals.session) {
        return res.redirect("/");
    }

    // Clear cookie
    res.clearCookie("session");

    // Invalidate session
    res.locals.session.active = false;
    await db.getRepository(Session).save(res.locals.session);

    // Redirect to home
    return res.redirect("/");
}