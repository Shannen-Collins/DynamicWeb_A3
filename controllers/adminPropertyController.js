//Imports node.js file system
const fs = require('fs');
//Imports path
const path = require('path');
//Defines property model
const Property = require('../models/property');
//Loads uploas middleware with upload filename check
const { UPLOAD_DIR, isUploadedName } = require('../middleware/upload');

//Builds dropdown options from a list of suburbs
function suburbOptions(suburbs, selected){
    return suburbs.map(name => ({name, selected: name === selected}));
}


//Turns raw form fields into trusted values
function readForm(body){
    return{
        address: (body.address || '').trim(),
        suburb: body.suburb,
        townCity: (body.townCity || '').trim(),
        description: (body.description || '').trim(),
        listPrice: body.listPrice,
        imageName: body.imageName,
        bedrooms: body.bedrooms,
        ensuite: body.ensuite ? 1 : 0,
        sold: body.sold ? 1 : 0,
        featured: body.featured ? 1 : 0,
        pool: body.pool ? 1 : 0,
        active: body.active ? 1 : 0
    };
}


//Returns a list of errors. with an empty list meaning the data is valid
function validate(data, suburbs){
    const errors = [];

    if(!data.address){
        errors.push('Address is required');
    }

    //Checks not null and is included in suburbs list
    if(!data.suburb || !suburbs.includes(data.suburb)){
        errors.push('Choose a valid suburb.');
    }

    if(!data.townCity){
        errors.push('Town / City is required');
    }

    if(!data.description){
        errors.push('Description is required');
    }

    //Checks that list price is a number and is above 0
    const listPrice = Number(data.listPrice);
    if(
        data.listPrice === undefined || 
        String(data.listPrice).trim() === '' || 
        data.listPrice === '' || 
        Number.isNaN(listPrice) || 
        !Number.isInteger(listPrice) ||
        !Number.isFinite(listPrice) ||
        listPrice < 0){
            errors.push('Price must be a number, 0 or more.');
        }

    //Checks that bedrooms is a number and is above 0
    const bedrooms = Number(data.bedrooms);
    if(data.bedrooms === undefined || 
        String(data.bedrooms).trim() === '' || 
        data.bedrooms === null ||
        Number.isNaN(bedrooms) || 
        bedrooms < 0 || 
        !Number.isInteger(bedrooms) ||
        !Number.isFinite(bedrooms)){
            errors.push('Bedrooms count must be a number, 0 or more.');
    }

    return errors;
}

//Deletes an uploaded photo that matches the upload filename conventions.
function removeImage(filename){
    if(!isUploadedName(filename)){
        return;
    }
    const file = path.join(UPLOAD_DIR, path.basename(filename));
    fs.unlink(file, (err) => {
        if (err && err.code !== 'ENOENT'){
            console.error('Could not delete photo: ', err.message);
        }
    });                                                                                                                    
}

//Lists all the properties on the admin property management page
async function listProperties(req, res){
    try{
        const properties = await Property.findAll( 
            {  
                //limited to 100 properties for loading ease
                limit: 100 ,
                order: [['id', 'DESC']],
                raw: true
            });
        res.render('admin-properties', {layout: 'admin', properties});
    }

    catch (error){
        console.error('Error loading properties:', error.message);
        res.status(500).send('Could not load properties');
    }
}

//Shows add new property form
function showNewForm(req,res){
    try{
    res.render('property-form', {
        layout: 'admin',
        heading: 'Add a property',
        action: '/admin/properties/new',
        property: {},
        suburbOptions: suburbOptions(res.locals.propertySuburbs)
    });
}
catch (error){
    console.error('Error showing new property form:', error);
    res.status(500).send('Could not load the add property form.');
}
}

//Creates a new property when everything is valid
async function createProperty(req, res){
    const data = readForm(req.body);
    const errors = validate(data, res.locals.propertySuburbs);
    const newImage = req.file ? req.file.filename : null;

    if (req.uploadError){
        errors.push(req.uploadError);
    }

    if(errors.length > 0){
        removeImage(newImage);
        return res.status(400).render('property-form', {
            layout: 'admin',
            heading: 'Add a property',
            action: '/admin/properties/new',
            property: data,
            suburbOptions: suburbOptions(res.locals.propertySuburbs, data.suburb),
            errors
        });
    }

    data.imageName = newImage;

    try{
        await Property.create(data);
        res.redirect('/admin/properties');
    }
    catch (error){
        removeImage(newImage);
        console.error('Error creating property:', error.message);
        res.status(500).send('Could not save the property.');
    }
    
}

//Shows edit property form, with the fields filled with the selected data
async function showEditForm(req,res) {
    try{
        const property = await Property.findByPk(req.params.id, { raw: true });
        
        //if property id is invalid, shows friendly error
        if(!property){
            return res.status(404).send(`
                <p> Sorry, the property you are looking for could not be found. </p>
                <p> <a href="/">Go Back Home</a> </p>
                `);
        }  
        
        //Converts the flag values into Boolean for checkboxes
        property.ensuite = Number(property.ensuite) === 1;
        property.pool = Number(property.pool) === 1;
        property.featured = Number(property.featured) === 1;
        property.sold = Number(property.sold) === 1;
        property.active = Number(property.active) === 1;

        res.render('property-form', {
            layout: 'admin',
            heading: 'Edit property',
            action: `/admin/properties/${property.id}/edit`,
            property,
            suburbOptions: suburbOptions(res.locals.propertySuburbs, property.suburb)
        });
    }
    catch (error){
        console.error('Error loading property:', error.message);
        res.status(500).send('Could not load the property.');
    }
    
}

//Updates property data based on changes to the input fields
async function updateProperty(req, res){
    const data = readForm(req.body);
    const errors = validate(data, res.locals.propertySuburbs);
    const newImage = req.file ? req.file.filename : null;

    if (req.uploadError){
        errors.push(req.uploadError);
    }


    if(errors.length > 0){
        removeImage(newImage);
        return res.status(400).render('property-form', {
            layout: 'admin',
            heading: 'Edit property',
            action: `/admin/properties/${req.params.id}/edit`,
            property: data,
            suburbOptions: suburbOptions(res.locals.propertySuburbs, data.suburb),
            errors
        });
    }

    try{
        const property = await Property.findByPk(req.params.id);
        
        //if property id is invalid, shows friendly error
        if(!property){
            removeImage(newImage);
            return res.status(404).send(`
                <p> Sorry, the property you are looking for could not be found. </p>
                <p> <a href="/">Go Back Home</a> </p>
                `);
        }

        const oldImage = property.imageName;

        //only change the image column when a new photo is chosen
        if(newImage){
            data.imageName = newImage;
        }

        await property.update(data);

        if (newImage){
            removeImage(oldImage);
        }

        res.redirect('/admin/properties');
    }
    catch (error){
        removeImage(newImage);
       console.error('Error updating property:', error.message);
        res.status(500).send('Could not update the property.');
    }
}

//Deletes selected property 
async function deleteProperty(req,res){
    try{
        const property = await Property.findByPk(req.params.id);

        //if property id is invalid, shows friendly error
        if (!property){
            return res.status(404).send(`
                <p> Sorry, the property you are looking for could not be found. </p>
                <p> <a href="/">Go Back Home</a> </p>
                `);
        }

        await property.destroy();
        removeImage(property.imageName);
        res.redirect('/admin/properties');
    }
    catch (error){
       console.error('Error deleting property:', error.message);
        res.status(500).send('Could not delete the property.');
    }
}


module.exports = { listProperties, showNewForm, createProperty, showEditForm, updateProperty, deleteProperty };