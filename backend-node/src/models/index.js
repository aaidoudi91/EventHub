// Central entry point for all models and the Sequelize instance.
// Import from here instead of requiring models individually across the codebase.
const sequelize = require('../config/database');
const Event = require('./event.model');
const Participant = require('./participant.model');

module.exports = { sequelize, Event, Participant };
