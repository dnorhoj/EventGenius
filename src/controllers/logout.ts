import type { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
    if (!res.locals.user) {
        res.redirect("/");
    }

    // TODO; Log out
}