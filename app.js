import MongoStore from 'connect-mongo';
// -------------------
// COOKIE PARSER
import cookieParser from 'cookie-parser';
// STANDARD EXPRESS SETUP
import dotenv from 'dotenv';
import express from 'express';
// UNUSED
// templating engine
// import ejs from 'ejs';
// TEMPLATE ENGINE
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import methodOverride from 'method-override';
import path from 'path';
import constants from './config/constants.js';
// to use config.env file
// DATABASE
import connectDB from './server/config/db.js';
import isActiveRoute from './server/helpers/routeHelpers.js';
import adminRoutes from './server/routes/admin.js';
// ROUTES
import mainRoutes from './server/routes/main.js';

// to use config.env file
dotenv.config();

const app = express(); // to initialize server
const PORT = 4000 || process.env.PORT; // second for live use

// connect to db
connectDB();

// MIDDLEWARE
// to be able to pass data in form
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // to use it

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      expires: Date.now() + 3600000,
      maxAge: 3600000,
    },
  }),
);


// setting public folder
app.use('/', express.static('./public'));


// TEMPLATE ENGINE
app.use(expressEjsLayouts); // to use layouts
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute;




// ROUTE HANDLING
// handling route for homepage
app.use('/', mainRoutes);

// separate for admin
app.use('/', adminRoutes);




// LAST TIHING I NEED TO LISTEN ON PORT
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  ``;
});
