"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let notes = [];
let nextId = 1;
// GET /notes
router.get('/', (req, res) => {
    res.json(notes);
});
// POST /notes
router.post('/', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const note = { id: nextId++, content };
    notes.push(note);
    res.status(201).json(note);
});
exports.default = router;
