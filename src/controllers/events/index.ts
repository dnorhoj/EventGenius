import type { RequestHandler } from "express";
import { db } from "../../database";
import { Event } from "../../models/event";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        res.redirect("/login");
        return;
    }

    // Get events created by users the current user is following
    const followingEvents = await db.getRepository(Event)
        .createQueryBuilder("event")
        .innerJoinAndSelect("event.organizer", "organizer")
        .innerJoinAndSelect("organizer.followers", "follower")
        .loadRelationCountAndMap("event.attendeeCount", "event.attendees")
        .where("follower.followerId = :id", { id: res.locals.user.id })
        .andWhere("event.date > :date", { date: new Date() })
        .orderBy("event.date", "ASC")
        .limit(5)
        .getMany();
    
    // Get popular events
    const popularEvents = await db.getRepository(Event)
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.attendees", "attendee")
        .loadRelationCountAndMap("event.attendeeCount", "event.attendees")
        .leftJoinAndSelect("event.organizer", "organizer")
        .addSelect("COUNT(attendee.id)", "attendeeCount")
        .where("event.public = true")
        .andWhere("event.date > :date", { date: new Date() })
        .groupBy("event.id")
        .addGroupBy("organizer.id")
        .addGroupBy("attendee.id")
        .limit(5)
        .getMany();

    res.render("events/index", { followingEvents, popularEvents });
}

export const post: RequestHandler = (req, res) => {
    res.render("events/index");
}
