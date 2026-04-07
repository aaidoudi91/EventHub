// Event routes — full CRUD with optional status filtering on list.
// All errors are forwarded to the global error handler via next(err).


const express = require('express');
const router = express.Router();
const { Event } = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const where = {};
        if (req.query.status) where.status = req.query.status;
        const events = await Event.findAll({ where, order: [['date', 'ASC']] });
        res.json(events);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        await event.update(req.body);
        res.json(event);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        await event.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
