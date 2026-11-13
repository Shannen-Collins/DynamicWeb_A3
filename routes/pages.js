//Imports express
const express = require('express');
//Defines router as express router
const router = express.Router();
//Imports properties controller
const propertiesController = require('../controllers/propertiesController');

//Route for home page with list of properties 
router.get('/', propertiesController.listProperties);

//Exports router to make available to other files
module.exports = router;