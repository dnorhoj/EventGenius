import { Request, Response, NextFunction } from 'express';
import { Session } from '../models/session';
import { db } from '../database';

export const user = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.session;

    if (!token) {
        return next();
    }

    const session = await db.getRepository(Session).findOne({
        where: {
            token,
            active: true
        },
        relations: ['user']
    });
    
    if (!session) {
        return next();
    }

    if (session.expires_at < new Date()) {
        return next();
    }

    res.locals.session = session;
    res.locals.user = session.user;

    next();
}
