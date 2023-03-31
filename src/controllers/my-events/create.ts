import type { RequestHandler } from "express";
import { object, string, bool, date, ValidationError } from "yup";
import { Event } from "../../models/event";
import { db } from "../../database";

export const get: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect("/login");
    }

    res.render("my-events/create");
}

const createEventSchema = object({
    name: string()
        .required("Event name is required"),
    description: string()
        .required("Event description is required"),
    public: bool().default(false),
    location: string()
        .when("noLocation", {
            is: false,
            then: (schema) => schema.required("Event location is required")
        }),
    noLocation: bool().default(false),
    date: date()
        .required("Event date is required")
});

export const post: RequestHandler = async (req, res) => {
    if (!res.locals.user) {
        return res.redirect("/login");
    }

    // Validate user input
    let createEventForm;
    try {
        createEventForm = await createEventSchema.validate(req.body);
    } catch (error) {
        if (error instanceof ValidationError) {
            // Render create event page with error message
            return res.render("my-events/create", {
                error: error.message,
                form: req.body
            });
        }

        return res.status(500).send("Something went wrong!");
    }

    // Create event
    const repo = db.getRepository(Event);
    const event = repo.create({
        name: createEventForm.name,
        description: createEventForm.description,
        public: createEventForm.public,
        location: createEventForm.location,
        date: createEventForm.date,
        organizer: res.locals.user,
        uuid: Event.generateUUID(),
    });

    const newEvent = await repo.save(event);

    res.redirect(`/my-events/${newEvent.uuid}`);
}