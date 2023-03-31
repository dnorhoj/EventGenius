import { Request, Response, NextFunction } from 'express';

export const activeUrl = (req: Request, res: Response, next: NextFunction) => {
    // Used in layout.ejs to set the active class on the navbar based on the current url
    // res.locals.active = (page: string) => req.path === page ? ' active' : '';

    // Used in layout.ejs to set the active class on the navbar based on the current url
    res.locals.active = (page: string) => {
        const re = new RegExp(`^${page}[\/]?$`);
        return re.test(req.path) ? ' active' : '';
    };
    next();
}