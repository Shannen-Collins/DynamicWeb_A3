//Loads information from .env file
require('dotenv').config();
//Imports express
const express  = require('express');
//Imports express sessions
const session = require('express-session');
//Imports path
const path = require('path');
//Imports express handlebars template engine
const { engine } = require('express-handlebars');
//Imports Morgan, HTTP Request logger for express
const morgan = require('morgan');

//Imports sequelize for database communication 
const sequelize = require('./database');
//Imports custom request logger
const logger = require('./middleware/logger');
//Imports the sidebar middleware
const sidebarData = require('./middleware/sidebar');
//Defines the page router
const pagesRouter = require('./routes/pages');

//Defines the authorised router
const authRouter = require('./routes/auth');
//Defines the admin router 
const adminRouter = require('./routes/admin');


//Imports the auth middleware
const { setAuthLocals, requireAdmin } = require('./middleware/auth');


//Defines property model
const Property = require('./models/property');

//Creates express application
const app = express();
//Defines port number, uses port environment variable or port 3000
const PORT = process.env.PORT || 3000;

//Enables handlebars engine 
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowedProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//Enables morgan logger
app.use(morgan('dev'));
//Enable custom logger
app.use(logger);

//Makes files in public folder accessible 
app.use(express.static(path.join(__dirname, 'public')));
//Parses express requests containing JSON data
app.use(express.json());
//Parses express form submissions
app.use(express.urlencoded({ extended: true}));

//Uses session secret
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, 
        maxAge: 1000 * 60 * 60
    }
}));

//Makes local authorisation available to every layout and view
app.use(setAuthLocals);


//Makes sidebar data available
app.use(sidebarData);

//Uses auth router
app.use('/', authRouter);
//Uses and links require admin into the admin routers
app.use('/admin', requireAdmin, adminRouter);

//Enables page routing from / 
app.use('/', pagesRouter);

//404 handler
app.use((req,res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found </h1>
        <p> The page you are looking for doesn't exist.</p>
        <a href="/">Go Home</a>
    `);
});

//Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <h1> 500 - Internal Server Error </h1>
        <p>Something went wrong on our end. </p>
        <a href="/"> Go Home </a>
    `);
});

//Confirms server starts up
const startServer = async () => {
    try{
        //Checks database connection
        await sequelize.authenticate();
        console.log("DB connected successfully.");

        //Checks the database is synchronised
        await sequelize.sync();
        console.log("DB synchronised");

        //Counts property records
        const count = await Property.count();
        console.log(`Properties in db: ${count} `);

        //Starts listening to specified port
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    }
    catch (error){
        console.error('Startup error:', error.message);
        process.exit(1);
    }
};

//Starts server 
startServer();