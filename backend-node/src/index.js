const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const eventRoutes = require('./routes/event.routes');
const participantRoutes = require('./routes/participant.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);

// Global error handler — must be registered after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Sync Sequelize models with the database, then start the server.
// { alter: true } updates existing tables to match model definitions without dropping data.
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
