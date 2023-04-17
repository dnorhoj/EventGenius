import { RequestHandler } from "express";
import { User } from "../../models/user";
import { db } from "../../database";
import { deleteFile } from "../../helpers/filestore";
import { File } from "../../models/file";

export const post: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    // @ts-ignore
    if (!res.locals.file) {
        return res.render('error/error', {
            error: 'No file uploaded'
        })
    }

    // Remove old profile picture if it exists
    if (res.locals.user.profilePicture) {
        try {
            await db.getRepository(User).save({
                id: res.locals.user.id,
                profilePicture: null
            })
            await db.getRepository(File).delete({ id: res.locals.user.profilePicture.id });
            await deleteFile(res.locals.user.profilePicture);
        } catch (err) {
            res.render('error/error', {
                error: 'Failed to delete old profile picture'
            });

            console.error(err);
            return;
        }
    }

    res.locals.user.profilePicture = res.locals.file;

    await db.getRepository(User).save(res.locals.user);

    res.redirect(`/user/${res.locals.user.username}`);
};