//Defines Admin model
const Admin = require('../models/admin');
//Imports bcrypt encryption for passwords
const bcrypt = require('bcryptjs');

//Turns raw form fields into values we can trust
function readForm(body){
    return{
        username: (body.username || '').trim(),
        password: (body.password || ''),
        confirmPassword: (body.confirmPassword || ''),
        name: (body.name || '').trim(),
    };
}

//Returns a list of problems. An empty list means the data is fine
function validate(data){
    const errors = [];

    if(!data.username){
        errors.push('Username is required');
    }

    if(!data.name){
        errors.push('Name is required');
    }

    if(!data.password){
        errors.push('Password is required');
    }

    if(!data.confirmPassword){
        errors.push('Password confirmation is required');
    }

    if(data.username && data.username.length < 2){
        errors.push('Username must be at least 2 characters');
    }

    if(data.password && data.confirmPassword && data.confirmPassword !== data.password){
        errors.push('Password confirmation must match password');
    }

    return errors;
}

//Gets the admin users from the database, not including password attribute
async function getUsers(){
    return Admin.findAll( 
            {  
                attributes: ['id', 'username', 'role', 'name'],
                order: [['id', 'ASC']],
                raw: true
            });
}

//Lists all the user on the admin registration page
async function listUsers(req, res){
    try{
        const users = await getUsers();
        res.render('registration', {
            layout: 'admin', 
            users,
            errors: [],
        });
    }

    catch (error){
        console.error('Error loading users:', error.message);
        res.status(500).send('Could not load users');
    }
}

//Creates admin user when everything is valid
async function createAdminUser(req, res){
    const data = readForm(req.body);
    const errors = validate(data);
    try{
        if(errors.length > 0){
            const users = await getUsers();
            
            return res.status(400).render('registration', {
                layout: 'admin', 
                users,
                errors,
                formData:{ 
                    username: data.username,
                    name: data.name
                },
            });
        }

        //Checks if username already exists
        const existingUser = await Admin.findOne({
            where: {username: data.username},
        });
        if(existingUser){
            const users = await getUsers();

            return res.status(400).render('registration', {
                layout: 'admin', 
                users,
                errors: ['Username already exists. Please choose another.'],
                formData:{ 
                    username: data.username,
                    name: data.name
                },
            });
        }
        
        //hashes password
        const hashPassword = await bcrypt.hash(data.password, 12);

        await Admin.create({
            username: data.username,
            passwordHash: hashPassword,
            role: 'admin',
            name: data.name,
        });
        return res.redirect('/admin/registration');
    }
    catch (error){
        console.error('Error creating admin user:', error.message);
        res.status(500).send('Could not save new user.');
    }
    
}

module.exports = { listUsers, createAdminUser };