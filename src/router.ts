import type { Application } from 'express';
import { uploadImage } from './helpers/filestore';

export default (app: Application) => {
    // Register routes
    app.get('/', require('./controllers/index').get);

    // Authentication routes
    app.get('/login', require('./controllers/login').get);
    app.post('/login', require('./controllers/login').post);
    app.get('/register', require('./controllers/register').get);
    app.post('/register', require('./controllers/register').post);
    app.get('/logout', require('./controllers/logout').get);

    // User routes
    app.get('/user', require('./controllers/user/index').get);
    app.get('/user/:username', require('./controllers/user/view').get);
    app.post('/user/:username/pfp', uploadImage('pfp'), require('./controllers/user/pfp').post);
    app.post('/user/:username/follow', require('./controllers/user/follow').post);
    app.get('/user-settings', require('./controllers/user/settings').get);

    // Event routes
    app.get('/events', require('./controllers/events/index').get);
    app.post('/events', require('./controllers/events/index').post);
    app.get('/events/:id', require('./controllers/events/view').get);
    app.post('/events/:id/respond', require('./controllers/events/respond').post);

    // My events
    app.get('/my-events', require('./controllers/my-events/index').get);
    app.get('/my-events/create', require('./controllers/my-events/create').get);
    app.post('/my-events/create', require('./controllers/my-events/create').post);
    app.get('/my-events/edit/:id', require('./controllers/my-events/edit').get);

    // 404
    app.use((req, res, next) => {
        return res.status(404).render('error/404');
    });
}