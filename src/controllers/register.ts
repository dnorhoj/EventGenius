import type { Request, Response } from 'express';
import { object, string, ref, ValidationError } from 'yup';
import { User } from '../models/user';
import { db } from '../database';
import bcrypt from 'bcrypt';
import { Session } from '../models/session';

export const get = async (req: Request, res: Response) => {
    if (res.locals.user) {
        res.redirect('/');
    }

    res.render('register');
}

const registerSchema = object({
    email: string().email("Please enter a valid email!").required("Email is required"),
    name: string().required("Name is required"),
    username: string().required("Username is required"),
    password: string().required("Password is required"),
    passwordConfirm: string().oneOf([ref('password')], "Passwords don't match").required()
});

export const post = async (req: Request, res: Response) => {
    // Check if user is already logged in
    if (res.locals.user) {
        return res.redirect('/');
    }

    // Validate input
    let registerForm;
    try {
        registerForm = await registerSchema.validate(req.body);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.render('register', { error: error.message });
        }

        return res.status(500).send("Something went wrong!")
    }

    // Check if user already exists
    const user = await db.getRepository(User).findOne({
        where: [
            { email: registerForm.email },
            { username: registerForm.username }
        ]
    });

    if (user) {
        return res.render('register', { error: 'User with that email or username already exists!' });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(registerForm.password, 10);

    // Create user
    const newUser = User.create(
        registerForm.username,
        registerForm.name,
        registerForm.email,
        hashedPassword
    );
    const createdUser = await db.getRepository(User).save(newUser);

    // Create session
    const session = Session.create(createdUser.id);
    const createdSession = await db.getRepository(Session).save(session);

    // Set session cookie
    res.cookie('session', createdSession.token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    res.redirect('/');
}