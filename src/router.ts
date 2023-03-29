import type { Application } from 'express';
import index from './controllers/index';

export default (app: Application) => {
    app.get('/', index);
    app.get('/users', index);
}