//Defines DataTypes
const { DataTypes } = require('sequelize');
//Imports sequelize
const sequelize = require('../database');

//Defines Property model with its attributes 
const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.MEDIUMINT,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: DataTypes.STRING(26),
        default: null,
        allowNull: true,
    },
    suburb: {
        type: DataTypes.STRING(20),
        default: null,
        allowNull: true
    },
    townCity: {
        type: DataTypes.STRING(33),
        default: null,
        allowNull: true,
        field: "town_city"
    },
    description: {
        type: DataTypes.TEXT,
        default: null,
        allowNull: true
    },
    listPrice: {
        type: DataTypes.BIGINT,
        default: null,
        allowNull: true,
        field: "list_price",
        validate: {
            min: 0
        }
    },
    imageName: {
        type: DataTypes.STRING(255),
        default: null,
        allowNull: true,
        field: "image_name"
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        default: null,
        allowNull: true
    },
    ensuite: {
        type: DataTypes.TINYINT(1),
        default: null,
        allowNull: true
    },
    sold: {
        type: DataTypes.TINYINT(1),
        default: null,
        allowNull: true
    },
    featured: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    pool: {
        type: DataTypes.TINYINT(1),
        default: null,
        allowNull: true
    },
    active: {
        type: DataTypes.TINYINT(1),
        default: 1,
        allowNull: true
    }
}, {
    tableName: 'properties',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
module.exports = Property;