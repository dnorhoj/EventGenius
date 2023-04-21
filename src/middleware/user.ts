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

    // Set locals, that will be available in all controllers and views
    res.locals.session = session;
    res.locals.user = session.user;

    // Check if user has verified their email
    if (!session.user.emailVerified) {
        // Check if user is trying to access a page that doesn't require email verification
        const allowedPaths = [
            /\/resend-verification-email/,
            /\/user-settings/,
            /\/verify\/.*/,
            /\/logout/
        ];

        if (allowedPaths.some(path => path.test(req.path))) {
            return next();
        }

        // Show email verification error page
        return res.render('error/email-verification', {
            resent: req.query.resent === 'true'
        });
    }

    next();
}
