import { randomUUID } from 'crypto';
import type { RequestHandler } from 'express';
import { sendVerificationEmail } from '../../helpers/email';
import { db } from '../../database';
import { User } from '../../models/user';

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    if (res.locals.user.emailVerified) {
        return res.status(403).render('error/error', {
            message: 'You have already verified your email address.'
        });
    }

    const token = randomUUID();

    const editedUser = await db.getRepository(User).save({
        id: res.locals.user.id,
        emailVerificationToken: token
    });

    // Merge edited user with the current user
    Object.assign(res.locals.user, editedUser);

    sendVerificationEmail(res.locals.user);

    res.redirect(`/?resent=true`);
}