import { RequestHandler } from "express";
import { User } from "../../models/user";
import { Follow } from "../../models/follow";
import { db } from "../../database";

// Follow/unfollow user
export const post: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    const username = req.params.username;

    if (username === res.locals.user.username) {
        return res.render('error/error', {
            error: "You can't follow yourself!"
        })
    }

    // Follow/unfollow request type
    const isFollowRequest = req.body.type === 'follow';

    // Check if user exists
    const otherUser = await db.getRepository(User).findOne({
        where: { username }
    })

    if (!otherUser) {
        return res.redirect(`/user/${username}`);
    }

    if (isFollowRequest) {
        // Follow
        await db.getRepository(Follow).save(Follow.create(
            { id: res.locals.user.id } as User,
            { id: otherUser.id } as User
        ));
    } else {
        // Unfollow
        await db.getRepository(Follow).delete({
            follower: { id: res.locals.user.id },
            following: { id: otherUser.id }
        });
    }


    return res.redirect(`/user/${username}`);
}