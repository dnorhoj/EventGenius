import type { RequestHandler } from 'express';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { db } from '../../database';

export const get: RequestHandler = async (req, res) => {
    const username = req.params.username;

    const user = await db.getRepository(User).findOne({
        where: { username },
        relations: { profilePicture: true }
    });

    if (!user) {
        return res.status(404).render('error/404');
    }

    // Check if user is following
    const isFollowing = await db.getRepository(Follow).exist({
        where: {
            follower: { id: res.locals.user.id },
            following: { id: user.id }
        }
    });


    res.render('user/view', { targetUser: user, isFollowing });
}
