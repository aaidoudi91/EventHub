const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Represents a person who can be registered to one or more events
const Participant = sequelize.define('Participant', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Participant;
