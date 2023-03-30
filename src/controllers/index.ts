import type { Request, Response } from 'express';
import { User } from '../models/user';
import { AppDataSource } from '../database';


export const get = async (req: Request, res: Response) => {
    // const user = new User();
    // user.name = 'John Doe';
    // user.email = 'test@example.com';
    // user.password = 'password';
    // user.isOrganizer = true;

    // await AppDataSource.manager.save(user);

    res.render('index', {user: "dnorhoj"});
}
