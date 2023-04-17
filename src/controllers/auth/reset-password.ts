import type { RequestHandler } from "express";
import { db } from "../../database";
import { PasswordReset } from "../../models/password-reset";
import { MoreThan } from "typeorm";
import { ValidationError, object, ref, string } from "yup";
import bcrypt from "bcrypt";
import { User } from "../../models/user";

export const get: RequestHandler = async (req, res) => {
    const token = req.params.token;

    if (!token) {
        return res.status(400).render("error/error", {
            error: "The verification link is invalid or has expired."
        });
    }

    // Check if token is valid
    if (!await db.getRepository(PasswordReset).exist({
        where: {
            token,
            expires: MoreThan(new Date()),
            used: false,
        }
    })) {
        return res.status(400).render("error/error", {
            error: "The verification link is invalid or has expired."
        });
    }

    res.render("auth/reset-password", { token });
}

const resetPasswordSchema = object({
    password: string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be at most 100 characters long")
        .required("Password is required"),
    confirmPassword: string()
        .oneOf([ref('password')], "Passwords don't match")
        .required(),
    token: string().required(),
});

export const post: RequestHandler = async (req, res) => {
    let resetPasswordForm;
    try {
        resetPasswordForm = await resetPasswordSchema.validate(req.body);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.render("auth/reset-password", { error: error.message, token: req.body.token });
        }

        return res.status(500).send("Something went wrong!");
    }

    const passwordReset = await db.getRepository(PasswordReset).findOne({
        where: {
            token: resetPasswordForm.token,
            expires: MoreThan(new Date()),
            used: false,
        },
        relations: { user: true }
    });;;

    // Check if token is valid
    if (!passwordReset) {
        return res.status(400).render("error/error", {
            error: "The verification link is invalid or has expired.",
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(resetPasswordForm.password, 10);

    // Update user password
    await db.getRepository(User).save({
        id: passwordReset.user.id,
        password: hashedPassword,
    });

    // Mark token as used
    await db.getRepository(PasswordReset).save({
        id: passwordReset.id,
        used: true,
    });

    res.redirect("/login?msg=Password+reset+successfully");
}
