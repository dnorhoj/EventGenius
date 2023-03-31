import type { Application } from 'express';

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
    app.get('/user-settings', require('./controllers/user/settings').get);

    // My events
    app.get('/my-events', require('./controllers/my-events/index').get);
    app.get('/my-events/create', require('./controllers/my-events/create').get);
    app.post('/my-events/create', require('./controllers/my-events/create').post);

    // 404
    app.use((req, res, next) => {
        if (req.method === 'GET') {
            return res.status(404).render('error/404');
        }

        next();
    });
}