//Defines property model
const Property = require('../models/property');
//Imports Sequelize
const {Sequelize} = require ('sequelize');

//Adds list of all suburbs from the properties to the sidebar 
async function sidebarData(req, res, next){
    try {
        const activeSuburb = req.query.suburb;
        const suburbs = await Property.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('suburb')) ,'suburb'] 
                ],
            raw: true
        });
        res.locals.sidebarSuburb = suburbs.map(s => ({ 
            name: s.suburb, 
            active: s.suburb === activeSuburb}));
        res.locals.showAll = !activeSuburb;
        next();
    }
    catch (error){
         console.error('Error loading suburbs on sidebar:', error.message);
         next(error);
    }
}
module.exports = sidebarData;