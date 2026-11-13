//Imports sequelize
const { Sequelize } = require('sequelize');
//Loads information from .env file
require('dotenv').config();

//Defines database connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        //Defines which language used
        dialect: 'mysql',
        //Stops print every sql query to terminal
        logging: false, 
        //How many db connections can be open at once
        pool: {
            //No more than 5 connections at once
            max: 5,
            //Allowed to close every connection when idle
            min: 0,
            //Wait 30 seconds for free connections before giving up
            acquire: 30000,
            //Close connection after 10 seconds of no use
            idle: 10000
        }
    }
);

//Exports database connection to make available to other files
module.exports = sequelize;