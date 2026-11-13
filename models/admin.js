//Defines DataTypes
const { DataTypes } = require('sequelize');
//Imports sequelize
const sequelize = require('../database');

//Defines Admin model with its attributes 
const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'admin'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'admins'
});

module.exports = Admin;