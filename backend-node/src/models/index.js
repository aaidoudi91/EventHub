const sequelize = require('../config/database');
const Event = require('./event.model');
const Participant = require('./participant.model');

module.exports = { sequelize, Event, Participant };
