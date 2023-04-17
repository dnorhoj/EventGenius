import { createTransport, createTestAccount, getTestMessageUrl } from 'nodemailer';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import { compile } from 'ejs';
import type { User } from '../models/user';

const viewsDir = join(__dirname, '..', 'views', 'emails');
const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

const compileView = async (template: string, data?: any) => {
    if (!existsSync(join(viewsDir, template + '.ejs'))) {
        throw new Error(`Email template ${template} does not exist`);
    }

    const html = await fs.readFile(join(viewsDir, template + '.ejs'), {
        encoding: 'utf-8',
        flag: 'r'
    });

    return compile(html)(data);
}

// The transporter is used to send emails
const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT as string),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    sender: process.env.MAIL_FROM
});

// Non-exported function to send emails
const sendMail = async (to: User, subject: string, html: string) => {
    const info = await transporter.sendMail({
        from: `"EventGenius" <${transporter.options.sender}>`,
        to: `"${to.name}" <${to.email}>`,
        subject,
        html
    });

    return info;
};

// Exported functions to send emails

export const sendVerificationEmail = async (to: User, token: string) => {
    const html = await compileView('verify-email', {
        name: to.name,
        verificationLink: `${siteUrl}/verify/${token}`
    });
    return sendMail(to, 'Verify your email', html);
}

export const sendPasswordResetEmail = async (to: User, token: string) => {
    const html = await compileView('reset-password', {
        name: to.name,
        resetLink: `${siteUrl}/reset-password/${token}`
    });
    return sendMail(to, 'Reset your password', html);
}