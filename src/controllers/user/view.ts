import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { db } from '../../database';

export const get: RequestHandler = async (req, res) => {
    const username = req.params.username;

    const user = await db.getRepository(User).findOne({
        where: { username }
    })

    if (!user) {
        return res.status(404).render('error/404');
    }

    res.render('user/view', { targetUser: user });
}