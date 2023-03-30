import type { Application } from 'express';
import * as index from './controllers/index';
import * as login from './controllers/login';
import * as register from './controllers/register';
import * as logout from './controllers/logout';

export default (app: Application) => {
    // Register routes
    app.get('/', index.get);

    // Authentication routes
    app.get('/login', login.get);
    app.post('/login', login.post);
    app.get('/register', register.get);
    app.post('/register', register.post);
    app.get('/logout', logout.get);
}