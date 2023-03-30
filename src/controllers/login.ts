import type { Request, Response } from 'express';
import { ValidationError, object, string } from 'yup';
import { compare } from 'bcrypt';
import { User } from '../models/user';
import { Session } from '../models/session';
import { db } from '../database';

export const get = async (req: Request, res: Response) => {
    if (res.locals.user) {
        res.redirect('/');
    }

    res.render('login');
}

const loginSchema = object({
    username: string().required("Username is required"),
    password: string().required("Password is required")
});

export const post = async (req: Request, res: Response) => {
    if (res.locals.user) {
        res.redirect('/');
    }

    let loginForm;
    try {
        loginForm = await loginSchema.validate(req.body);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.render('login', { error: error.message });
        }

        return res.status(500).send("Something went wrong!")
    }

    const user = await db.getRepository(User).findOne({
        where: [
            { username: loginForm.username }
        ]
    });

    if (!user) {
        return res.render('login', { error: 'Invalid username or password!' });
    }

    const passwordMatch = await compare(loginForm.password, user.password);

    if (!passwordMatch) {
        return res.render('login', { error: 'Invalid username or password!' });
    }

    const session = Session.create(user.id);

    await db.getRepository(Session).save(session);

    res.cookie('session', session.token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.redirect('/');
}