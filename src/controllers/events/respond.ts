import { RequestHandler } from "express";

export const post: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    console.log(req.params.id);

    
    res.redirect(`/events/${req.params.id}`)
}