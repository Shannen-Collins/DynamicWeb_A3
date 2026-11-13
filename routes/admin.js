//Imports express
const express = require('express');
//Defines router as express router
const router = express.Router();

//Imports the admin property controller
const adminPropertyController = require('../controllers/adminPropertyController.js');
//Imports the super admin property controller
const superAdminUserController = require('../controllers/superAdminUserController.js');

//Imports the upload image middleware
const { uploadImage } = require('../middleware/upload');
//Imports the load suburbs middleware 
const loadSuburbs = require('../middleware/propertySuburb');
//Imports the require admin and super admin authentication middleware 
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

//Makes the suburbs available for admin dropdowns
router.use(loadSuburbs);
//Ensures that only admin users have access to the routes below unless specified otherwise
router.use(requireAdmin);

//Route to the admin dashboard 
router.get('/', (req, res) => {
    res.render('dashboard', {layout: 'admin' });
});

    //Route to the properties management page with the list of properties
    router.get('/properties', adminPropertyController.listProperties);

    //Route to the adding new properties page
    router.get('/properties/new', adminPropertyController.showNewForm);
    //Route for submitting a new property
    router.post('/properties/new', uploadImage, adminPropertyController.createProperty);

    //Route to the editing properties page
    router.get('/properties/:id/edit', adminPropertyController.showEditForm);
    //Route for submitting updates or changes to properties
    router.post('/properties/:id/edit', uploadImage, adminPropertyController.updateProperty);

    //Route for deleting a certain property
    router.post('/properties/:id/delete', adminPropertyController.deleteProperty);

//Route to Registeration Page
router.get('/registration', requireSuperAdmin, superAdminUserController.listUsers);
//Route for new admin user registrations being submitted on registration page
router.post('/registration', requireSuperAdmin, superAdminUserController.createAdminUser);

//Exports router to make available to other files
module.exports = router;