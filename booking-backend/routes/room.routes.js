const express = require('express');
const router = express.Router();
const Room = require('../models/room.model');

// Endpoint to save room data
router.post('/room', async (req, res) => {
    try {
        const rooms = req.body; // Expecting an array of room objects

        // Save each room to the database
        const savedRooms = await Room.insertMany(rooms);

        res.status(201).json({ message: 'Rooms saved successfully', data: savedRooms });
    } catch (error) {
        console.error('Error saving rooms:', error);
        res.status(500).json({ message: 'Failed to save rooms', error });
    }
});

router.get('/getAllRooms', async (req, res) => {
    try {
        const rooms = await Room.find(); // Retrieve all rooms from the database
        res.status(200).json({ data: rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Failed to fetch rooms', error });
    }
});

module.exports = router;
