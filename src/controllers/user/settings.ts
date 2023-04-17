import type { RequestHandler } from 'express';
import { ValidationError, object, string, InferType } from 'yup';
import { db } from '../../database';
import { User } from '../../models/user';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '../../helpers/email';

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    res.render('user/settings', { formUser: res.locals.user });
}

const settingsSaveSchema = object({
    email: string()
        .email("Please enter a valid email!")
        .required("Email is required"),
    name: string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long")
        .required("Name is required"),
    bio: string()
        .nullable()
        .max(200, "Bio must be at most 200 characters long"),
    password: string()
        .required("Password is required"),
});

export const post: RequestHandler = async (req, res) => {
    let settingsForm: InferType<typeof settingsSaveSchema>;
    try {
        settingsForm = await settingsSaveSchema.validate(req.body);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.render('user/settings', { error: error.message });
        }

        return res.status(500).send("Something went wrong!")
    }

    // Validate password
    const user = await db.getRepository(User).findOne({
        where: { id: res.locals.user.id }
    });

    if (!user) {
        return res.status(500).send("Something went wrong!")
    }

    if (!await compare(settingsForm.password, user.password)) {
        return res.render('user/settings', { error: "Password is incorrect!", formUser: settingsForm });
    }

    if (!settingsForm.bio) {
        settingsForm.bio = null;
    }

    // Start a transaction
    await db.transaction(async (transaction) => {
        if (settingsForm.email !== user.email) {
            const emailExists = await transaction.getRepository(User).findOne({
                where: { email: settingsForm.email }
            });

            if (emailExists) {
                return res.render('user/settings', { error: "Email is already in use!", formUser: settingsForm });
            }


            const verificationToken = randomUUID();

            // Update data
            const editedUser = await db.getRepository(User).save({
                id: user.id,
                email: settingsForm.email,
                emailVerified: false,
                emailVerificationToken: verificationToken,
                bio: settingsForm.bio,
                name: settingsForm.name
            });

            // Send verification email
            await sendVerificationEmail(editedUser, verificationToken);
        }

        // Update user
        await db.getRepository(User).save({
            id: user.id,
            name: settingsForm.name,
            bio: settingsForm.bio
        });
    });

    res.redirect('/user/');
}