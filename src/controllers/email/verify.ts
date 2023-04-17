import type { RequestHandler } from 'express';
import { db } from '../../database';
import { User } from '../../models/user';

export const get: RequestHandler = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        return res.status(400).render('error/error', {
            error: 'Invalid verification token.'
        });
    }

    // Get user with token
    const user = await db.getRepository(User).findOne({
        where: {
            emailVerificationToken: token
        }
    });

    if (!user) {
        return res.status(400).render('error/error', {
            error: 'The verification link is invalid or has expired.'
        });
    }

    // Verify user
    await db.getRepository(User).save({
        id: user.id,
        emailVerified: true,
        emailVerificationToken: null
    });

    res.redirect('/');
}
