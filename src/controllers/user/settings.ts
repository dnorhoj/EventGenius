import type { RequestHandler } from 'express';

export const get: RequestHandler = (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    res.render('user/settings');
}