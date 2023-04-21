import type { Application } from 'express';
import { uploadImage } from './helpers/filestore';

export default (app: Application) => {
    // Register routes
    app.get('/', require('./controllers/index').get);
    
    // Email verification routes
    app.get('/resend-verification-email', require('./controllers/email/resend-verification').get);
    app.get('/verify/:token', require('./controllers/email/verify').get);

    // Authentication routes
    app.get('/login', require('./controllers/auth/login').get);
    app.post('/login', require('./controllers/auth/login').post);
    app.get('/register', require('./controllers/auth/register').get);
    app.post('/register', require('./controllers/auth/register').post);
    app.get('/logout', require('./controllers/auth/logout').get);
    app.get('/forgot-password', require('./controllers/auth/forgot-password').get);
    app.post('/forgot-password', require('./controllers/auth/forgot-password').post);
    app.get('/reset-password/:token', require('./controllers/auth/reset-password').get);
    app.post('/reset-password/:token', require('./controllers/auth/reset-password').post);

    // User routes
    app.get('/user', require('./controllers/user/index').get);
    app.get('/user/:username', require('./controllers/user/view').get);
    app.post('/user/:username/pfp', uploadImage('pfp'), require('./controllers/user/pfp').post);
    app.post('/user/:username/follow', require('./controllers/user/follow').post);
    app.get('/user-settings', require('./controllers/user/settings').get);
    app.post('/user-settings', require('./controllers/user/settings').post);

    // Event routes
    app.get('/events', require('./controllers/events/index').get);
    app.get('/events/:id', require('./controllers/events/view').get);
    app.post('/events/:id/respond', require('./controllers/events/respond').post);
    app.post('/events/:id/delete', require('./controllers/events/delete').post);

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