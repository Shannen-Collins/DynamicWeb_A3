//Imports bcrypt encryption for passwords
const bcrypt = require('bcryptjs');
//Defines Admin model
const Admin = require('../models/admin');

//Shows login if admin is not logged in. If admin, redirect to admin dashboard
function showLogin(req, res){
    if(req.session.adminId){
        return res.redirect('/admin');
    }
    res.render('login');
}

//Handles login authorisation
async function handleLogin(req, res) {
    const { username, password } = req.body;
    const failMessage = 'Invalid username or password.';

    if(!username || !password) {
        return res.status(401).render('login', {error: failMessage, username });
    }
    
    try{
        const admin = await Admin.findOne({
            where: {username}
        });
        const passwordMatches = admin 
            ? await bcrypt.compare(password, admin.passwordHash) 
            : false;
        
        if (!passwordMatches){
            return res.status(401).render('login', {error: failMessage, username });
        }

        req.session.adminId = {id: admin.id, role: admin.role};
        res.redirect('/admin');
    } catch (error){
        console.error('Login error:', error.message);
        res.status(500).send('Could not log in');
    }
}

//Handles logout by destroying login session
function handleLogout(req, res){
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
}

module.exports = { showLogin, handleLogin, handleLogout };