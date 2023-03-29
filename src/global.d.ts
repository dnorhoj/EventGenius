import type { Response } from 'express';

declare global {
    namespace Express {
        interface Response {
            renderView: (view: string, options?: object, callback?: (err: Error, html: string) => void) => void;
        }
    }
}