import type { RequestHandler } from 'express';

export const get: RequestHandler = (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    res.redirect(`/user/${res.locals.user.username}`);
}