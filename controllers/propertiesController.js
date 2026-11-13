//Defines property model
const Property = require('../models/property');

//Lists properties on home page based on suburb filter if selected
    //shows all properties if suburb not selected
async function listProperties(req, res){
    try{
        const {suburb} = req.query;
        const where = suburb ? {suburb} : {};
        const properties = await Property.findAll( 
            {   where, 
                limit: 21 ,
                order: [['id', 'DESC']]
            });
        res.render('home', {properties});
    }

    catch (error){
        console.error('Error loading properties:', error.message);
        res.status(500).send('Could not load properties');
    }
}
module.exports = {listProperties};