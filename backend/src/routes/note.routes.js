const express = require('express');
const NoteController = require('../controllers/note.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All note routes require authentication
router.use(AuthMiddleware.authenticate);

// CRUD operations for notes
router.post('/', NoteController.createNote);
router.get('/', NoteController.getNotes);
router.get('/search', NoteController.searchNotes);
router.get('/stats', NoteController.getNotesStats);
router.get('/:id', NoteController.getNoteById);
router.put('/:id', NoteController.updateNote);
router.delete('/:id', NoteController.deleteNote);

// Tag operations on notes
router.post('/:id/tags/:tagId', NoteController.addTagToNote);
router.delete('/:id/tags/:tagId', NoteController.removeTagFromNote);

// Get notes by tag
router.get('/by-tag/:tagId', NoteController.getNotesByTag);

// Archive/unarchive note
router.post('/:id/archive', NoteController.archiveNote);
router.post('/:id/unarchive', NoteController.unarchiveNote);

module.exports = router;
