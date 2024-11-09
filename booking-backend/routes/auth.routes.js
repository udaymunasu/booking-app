const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controller/authController');


router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 3 }),
    body('name').notEmpty()
], authController.register);

router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], authController.login);
router.post('/logout', authController.logout);

// Get all users
router.get('/users', authController.getAllUsers);

// Update a user
router.put('/users/:userId', authController.updateUser); // :userId is a URL parameter

// Delete a user
router.delete('/users/:userId', authController.deleteUser); // :userId is a URL parameter


module.exports = router;
