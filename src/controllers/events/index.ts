import type { RequestHandler } from "express";
import { db } from "../../database";
import { Event } from "../../models/event";
import { EventUserStatus } from "../../models/event-user";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        res.redirect("/login");
        return;
    }

    let search = req.query.q as string | undefined;

    let followingEvents, popularEvents, searchEvents;
    if (!search) {
        // Get events created by users the current user is following
        followingEvents = await Event.cardSelectBuilder()
            .innerJoinAndSelect("organizer.followers", "follower")
            .andWhere("follower.followerId = :userId", { userId: res.locals.user.id })
            .addGroupBy("follower.id")
            .limit(5)
            .getMany();


        // Get popular events
        popularEvents = await Event.cardSelectBuilder()
            .limit(5)
            .getMany();
    } else {
        // Escape LIKE characters
        search = search.replace(/[_%]/g, "\\$&");

        // Search by query
        searchEvents = await Event.cardSelectBuilder()
            .andWhere("(event.name ILIKE :search OR event.description ILIKE :search)", { search: `%${search}%` })
            .limit(20)
            .getMany();
    }


    res.render("events/index", { followingEvents, popularEvents, searchEvents });
}
