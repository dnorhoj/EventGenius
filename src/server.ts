import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import router from './router';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';

import { user } from './middleware/user';
import { activeUrl } from './middleware/view';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// CDN route
app.get('/cdn/:id', require('./controllers/cdn').get);

// Views
app.set('views', path.join(__dirname, 'views/'))
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Custom middleware
app.use(activeUrl);
app.use(user);

// Routes
router(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});