import express from 'express';
import path from 'path';
import router from './router';
import expressLayouts from 'express-ejs-layouts';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('views', path.join(__dirname, 'views/'))
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Routes
router(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});