const express = require('express');
const TagController = require('../controllers/tag.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes (for getting all tags and color options)
router.get('/', TagController.getTags);
router.get('/colors', TagController.getColorOptions);
router.get('/search', TagController.searchTags);
router.get('/stats', TagController.getTagStats);
router.get('/:id', TagController.getTagById);

// Protected routes (require authentication)
router.use(AuthMiddleware.authenticate);

// CRUD operations for tags (authenticated)
router.post('/', TagController.createTag);
router.put('/:id', TagController.updateTag);
router.delete('/:id', TagController.deleteTag);

// User-specific tag operations
router.get('/user/my-tags', TagController.getUserTags);
router.get('/user/most-used', TagController.getMostUsedTags);

module.exports = router;
