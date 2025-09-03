// Express router for tags API (using compiled controller)
const express = require('express');
const router = express.Router();
const { TagController } = require('./TagController');

router.get('/', TagController.getAll);
router.get('/:id', TagController.getOne);
router.post('/', TagController.create);
router.put('/:id', TagController.update);
router.delete('/:id', TagController.delete);

module.exports = router;
