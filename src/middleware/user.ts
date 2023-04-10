import { RequestHandler } from 'express';
import { Session } from '../models/session';
import { db } from '../database';

export const user: RequestHandler = async (req, res, next) => {
    const token = req.cookies.session;

    if (!token) {
        return next();
    }

    // Get user with profile picture from session token
    const session = await db.getRepository(Session).findOne({
        where: {
            token,
            active: true
        },
        relations: {
            user: { profilePicture: true }
        }
    });

    if (!session || session.expires_at < new Date()) {
        res.clearCookie('session');
        return next();
    }

    res.locals.session = session;
    res.locals.user = session.user;

    next();
}
