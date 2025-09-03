// Express router for auth API (using compiled controller)
const express = require('express');
const router = express.Router();
const { AuthController } = require('./AuthController');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/setup-default-user', AuthController.setupDefaultUser);
// Add more auth routes as needed

module.exports = router;
