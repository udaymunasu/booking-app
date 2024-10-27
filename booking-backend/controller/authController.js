const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered', data: user });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if user exists and passwords match
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Instead of generating a token, you can just return a success message or user info
    res.json({ message: 'Login successful', user: { username: user.username } });
};

exports.logout = (req, res) => {
    // Clear token from client-side or invalidate session on server
    res.json({ message: 'Logged out' });
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database
        res.status(200).json({ data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};



// Update a user
exports.updateUser = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is passed as a URL parameter
    const { username, password } = req.body;

    try {
        const updatedData = {};
        if (username) updatedData.username = username;
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10); // Hash new password if provided
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated', data: user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is passed as a URL parameter

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted', data: user });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};
