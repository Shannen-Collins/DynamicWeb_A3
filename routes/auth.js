//Imports express
const express = require('express');
//Defines router as express router
const router = express.Router();
//Imports authentication controller
const authController = require('../controllers/authController');

//Route to the login page
router.get('/login', authController.showLogin);
//Route for handling login process
router.post('/login', authController.handleLogin);
//Route for handling logout process
router.post('/logout', authController.handleLogout);

//Exports router to make available to other files
module.exports = router;