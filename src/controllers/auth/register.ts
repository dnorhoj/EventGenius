import type { RequestHandler } from 'express';
import { object, string, ref, ValidationError } from 'yup';
import { User } from '../../models/user';
import { db } from '../../database';
import bcrypt from 'bcrypt';
import { Session } from '../../models/session';
import { sendVerificationEmail } from '../../helpers/email';

export const get: RequestHandler = async (req, res) => {
	if (res.locals.user) {
		res.redirect('/');
	}

	res.render('auth/register');
}

const registerSchema = object({
	email: string()
		.email("Please enter a valid email!")
		.required("Email is required"),
	name: string()
		.min(3, "Name must be at least 3 characters long")
		.max(50, "Name must be at most 50 characters long")
		.required("Name is required"),
	username: string()
		.min(3, "Username must be at least 3 characters long")
		.max(50, "Username must be at most 50 characters long")
		.matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
		.required("Username is required"),
	password: string()
		.min(8, "Password must be at least 8 characters long")
		.max(100, "Password must be at most 100 characters long")
		.required("Password is required"),
	passwordConfirm: string()
		.oneOf([ref('password')], "Passwords don't match")
		.required()
});

export const post: RequestHandler = async (req, res) => {
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
			return res.render('auth/register', { error: error.message });
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
		return res.render('auth/register', { error: 'User with that email or username already exists!' });
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

	// Send verification email
	sendVerificationEmail(createdUser);

	res.redirect('/');
}