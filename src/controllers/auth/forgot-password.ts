import type { RequestHandler } from "express";
import { ValidationError, object, string } from 'yup';
import { db } from "../../database";
import { User } from "../../models/user";
import { randomUUID } from "crypto";
import { PasswordReset } from "../../models/password-reset";
import { sendPasswordResetEmail } from "../../helpers/email";

export const get: RequestHandler = async (req, res) => {
  return res.render('auth/forgot-password');
}

const forgotPasswordSchema = object({
  email: string().email("Invalid email address").required("Email is required")
});

export const post: RequestHandler = async (req, res) => {
  let forgotPasswordForm;
  try {
    forgotPasswordForm = await forgotPasswordSchema.validate(req.body);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.render('auth/forgot-password', { error: error.message });
    }

    return res.status(500).send("Something went wrong!")
  }

  const user = await db.getRepository(User).findOne({
    where: {
      email: forgotPasswordForm.email
    }
  });

  if (!user) {
    return res.render('auth/forgot-password', { success: true });
  }

  const token = randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 2);
  await db.getRepository(PasswordReset).save({
    user: { id: user.id },
    token,
    expires
  })

  sendPasswordResetEmail(user, token);

  res.render('auth/forgot-password', { success: true });
}
