require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../database');
const Admin = require('../models/admin');

//Adds a default admin user to the database with the super admin role
async function seed(){
    try{
        await sequelize.sync();
        const existing = await Admin.findOne({
            where: {username: 'admin'}
        });
        if (existing) {
            console.log('Admin account already exists. Nothing to do.');
            return;
        }

        const passwordHash = await bcrypt.hash('estate2026', 10);


        await Admin.create({
            username: 'admin',
            passwordHash,
            role: 'super admin',
            name: 'Super Admin'
        });
        console.log('Admin account created. Username: admin');
    }
    catch (error){
        console.error('Seed failed:', error.message);
    }
    finally {
        await sequelize.close();
    }
}
seed();