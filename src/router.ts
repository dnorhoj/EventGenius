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
    app.get('/my-events', require('./controllers/my-events/index').get);

    // 404
    app.use((req, res) => {
        res.status(404).render('error/404');
    });
}