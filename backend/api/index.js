// Vercel-compatible Express serverless function (CommonJS)
const express = require('express');
const cors = require('cors');
require('dotenv/config');
const { NoteController } = require('./NoteController');
const { AuthController } = require('./AuthController');
const { TagController } = require('./TagController');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Notes routes
const notesRouter = express.Router();
notesRouter.get('/', NoteController.getAll);
notesRouter.get('/:id', NoteController.getOne);
notesRouter.post('/', NoteController.create);
notesRouter.put('/:id', NoteController.update);
notesRouter.delete('/:id', NoteController.delete);
notesRouter.post('/:id/archive', NoteController.archive);
notesRouter.post('/:id/unarchive', NoteController.unarchive);
notesRouter.post('/:id/tags', NoteController.addTag);
notesRouter.delete('/:id/tags/:tagId', NoteController.removeTag);
app.use('/api/notes', notesRouter);

// Auth routes
const authRouter = express.Router();
authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);
authRouter.post('/setup-default-user', AuthController.setupDefaultUser);
app.use('/api/auth', authRouter);

// Tags routes
const tagsRouter = express.Router();
tagsRouter.get('/', TagController.getAll);
tagsRouter.get('/:id', TagController.getOne);
tagsRouter.post('/', TagController.create);
tagsRouter.put('/:id', TagController.update);
tagsRouter.delete('/:id', TagController.delete);
app.use('/api/tags', tagsRouter);

// Vercel serverless handler
module.exports = app;
