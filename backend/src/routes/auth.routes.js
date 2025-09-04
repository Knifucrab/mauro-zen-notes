const express = require('express');
const AuthController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Route to create default admin user (should be protected in production)
router.post('/create-default-user', AuthController.createDefaultUser);

// Protected routes (require authentication)
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);
router.put('/profile', AuthMiddleware.authenticate, AuthController.updateProfile);
router.post('/change-password', AuthMiddleware.authenticate, AuthController.changePassword);
router.post('/refresh-token', AuthMiddleware.authenticate, AuthController.refreshToken);
router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

module.exports = router;
