const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authController.verifyToken, authController.getProfile);
router.put('/profile', authController.verifyToken, authController.updateProfile);
router.post('/change-password', authController.verifyToken, authController.changePassword);

module.exports = router;