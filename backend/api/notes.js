// Express router for notes API (using compiled controller)
const express = require('express');
const router = express.Router();
const { NoteController } = require('./NoteController');

router.get('/', NoteController.getAll);
router.get('/:id', NoteController.getOne);
router.post('/', NoteController.create);
router.put('/:id', NoteController.update);
router.delete('/:id', NoteController.delete);
router.post('/:id/archive', NoteController.archive);
router.post('/:id/unarchive', NoteController.unarchive);
router.post('/:id/tags', NoteController.addTag);
router.delete('/:id/tags/:tagId', NoteController.removeTag);

module.exports = router;
