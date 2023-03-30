import type { Request, Response } from "express";
import { Session } from "../models/session";
import { db } from "../database";

export const get = async (req: Request, res: Response) => {
    // Check if user is logged in
    if (!res.locals.session) {
        return res.redirect("/login");
    }

    // Clear cookie
    res.clearCookie("session");

    // Invalidate session
    res.locals.session.active = false;
    await db.getRepository(Session).save(res.locals.session);

    // Redirect to home
    return res.redirect("/");
}