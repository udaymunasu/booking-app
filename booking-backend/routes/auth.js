const express = require('express');
const { register, login, logout, updateUser, deleteUser, getAllUsers } = require('../controller/authController');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Get all users
router.get('/users', getAllUsers);

// Update a user
router.put('/users/:userId', updateUser); // :userId is a URL parameter

// Delete a user
router.delete('/users/:userId', deleteUser); // :userId is a URL parameter


module.exports = router;
