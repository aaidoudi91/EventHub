// Participant routes — CRUD operations for the Participant entity.
// All database interactions are delegated to Sequelize via the Participant model.
// Errors are forwarded to the global error handler middleware via next(err).


const express = require('express');
const router = express.Router();
const { Participant } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/participants
router.get('/', authenticate, async (req, res, next) => {
    try {
        const participants = await Participant.findAll({ order: [['last_name', 'ASC']] });
        res.json(participants);
    } catch (err) {
        next(err);
    }
});

// GET /api/participants/:id
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        if (!participant) return res.status(404).json({ error: 'Participant not found' });
        res.json(participant);
    } catch (err) {
        next(err);
    }
});

// POST /api/participants
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const participant = await Participant.create(req.body);
        res.status(201).json(participant);
    } catch (err) {
        next(err);
    }
});

// PUT /api/participants/:id
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        if (!participant) return res.status(404).json({ error: 'Participant not found' });
        await participant.update(req.body);
        res.json(participant);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/participants/:id
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        if (!participant) return res.status(404).json({ error: 'Participant not found' });
        await participant.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
