//Defines property model
const Property = require('../models/property');
//Imports Sequelize
const {Sequelize} = require ('sequelize');

//Adds list of all suburbs from the properties to the sidebar 
async function loadPropertySuburbs(req, res, next){
    try {
        const suburbs = await Property.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('suburb')) ,'suburb'] 
                ],
            raw: true
        });
        res.locals.propertySuburbs = suburbs.map(s => s.suburb);
        next();
    }
    catch (error){
         console.error('Error loading suburbs:', error.message);
         next(error);
    }
}
module.exports = loadPropertySuburbs;