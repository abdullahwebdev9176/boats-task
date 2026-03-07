const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const handlebars = require('express-handlebars');
const helpers = require('./helpers/hbs-helpers');
const routes = require('./routes/index');
const feedRoute = require('./routes/boat-feed');
const {connectDB} = require('./config/db');
const cronFeed = require('./cron/cron-feed');

connectDB();


dotenv.config();
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, 'public');
const partialsPath = path.join(__dirname, 'views/partials');
const layoutsPath = path.join(__dirname, 'views/layouts');
const frontendPages = path.join(__dirname, 'views/frontend-pages');

console.log('Path:', staticPath);

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: layoutsPath,
    partialsDir: partialsPath,
    helpers: helpers
}))

app.use(express.static(staticPath));
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', frontendPages);

// routes 

app.use('/', routes)
app.use('/api', feedRoute)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});