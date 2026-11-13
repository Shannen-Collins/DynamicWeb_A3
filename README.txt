## Dynamic Web Development | Assessment 3 | BICT

# Description:

This project is a real estate web application for listing properties. 

Visitor can view and filter the properties on the website, but cannot make any changes. Authenticated users with an admin or super admin account can log in to manage the property listings, with adding, updating and deleting properties. 

The super admin account has additional permissions, being the only account type that can register new admin users. 

This application was built using Node.js, Express.js, Handlebars and Sequelize. Visual Studio Code was used as the primary development environment. MySQL was used as the database.


# Limitations: 

This is a demo site. The "Learn more about Us" button is currently unavailable. 

The application requires a working MySQL database connection to operate. The super admin seed script must be run before the super admin can login for the first time.


# Steps for running the project:

Prerequisites (Ensure the following are installed):
Node.js	
npm 
MySQL database Server
phpMyAdmin database manager

Steps:
1. Download the project file 
2. Open the project file in Visual Studio Code (or another suitable code editor)
3. Install required dependencies - 
	npm install
4. Create a .env file in root project directory
5. In the .env file, include the following fields and your database configurations. Change the database credentials if your MySQL configuration differs.
	DB_HOST=localhost
	DB_USER=root
	DB_PASSWORD=
	DB_NAME=realestate 
	DB_PORT=3306
	PORT=3000
	SESSION_SECRET=(your_session_secret)
6. Ensure the database server and phpMyAdmin are running. Open phpMyAdmin in a web browser under localhost.
7. Create a database named 'realestate' if it does not already exist
8. Ensure the database connection details in the .env file are correct
9. Start the web application - 
	npm run dev
10. Once the server has started successfully, open a browser and visit - http://localhost:3000/


# Login Details:

Ensure database configuration is correct before continuing.

To create the super admin account in the database, run the following command once in the terminal - 
	node .\scripts\seedAdmin.js 

Super Admin details:
name: Super Admin
username: admin
password: estate2026 

Additional users with the role of admin (not super admin) can be added under the admin manage users section of the application. All new registered users are given the role of admin, not super admin.

For consistency, keep the following pattern: 
name: Admin One
username: admin1
password: estate2026

All passwords are hashed before being added to the database server.


# Extension Task:

The extension task was attempted and involved implementing multiple user roles, with admin and super admin. It also included the super admin's ability to register new admin users. A regular admin, nor a website visitor, cannot register or create other administrators. 

Here are the following changes made to the code to include this feature:
- Added role to model/admin.js and to database (super admin and admin)
- Added super admin role to the seed admin in scripts/seedAdmin.js
- Added requireSuperAdmin and isSuperAdmin for setAuthLocals in middleware/auth.js 
- Made sure the logged-in role, along with the id, in the session was stored with the controllers/authController.js 
- Added get and post routes for registration page under routes/admin.js, making sure they require super admin
- Removed previous registration routing on routes/pages.js and registration link from home navigation.
- Added controllers/superAdminUserController.js to load and add admin users
- Adjusted registration.handlebars for functionality and to display current users
- Adjusted dashboard.handlebars with {{#if isSuperAdmin}}

Extension outcome:
The extension task was successfully implemented. The application now supports two different administrator roles with separate permissions. 


