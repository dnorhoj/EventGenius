import type { RequestHandler } from 'express';
import { User } from '../models/user';
import { db } from '../database';


export const get: RequestHandler = async (req, res) => {
    // const user = new User();
    // user.name = 'John Doe';
    // user.email = 'test@example.com';
    // user.password = 'password';
    // user.isOrganizer = true;

    // await AppDataSource.manager.save(user);

    res.render('index');
}
