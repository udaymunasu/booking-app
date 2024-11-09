const Hotel = require('../models/hotel.model');

exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createHotel = async (req, res) => {
    try {
        const { name, description, location, pricePerNight, amenities, images, roomTypes } = req.body;

        // Clean up the images field (ensure only strings are present)
        const cleanedImages = Array.isArray(images) ? images.filter(image => typeof image === 'string') : [images];

        // Validate that images is either a string or an array of strings
        if (!cleanedImages.every(v => typeof v === 'string')) {
            return res.status(400).json({ message: "Images must be a string or an array of strings" });
        }

        // Create hotel object with cleaned images data
        const hotel = new Hotel({
            name,
            description,
            location,
            pricePerNight,
            amenities,
            images: cleanedImages, // Always store as an array of strings
            roomTypes,
        });

        // Save the hotel to the database
        await hotel.save();
        res.status(201).json(hotel);

    } catch (error) {
        console.error("Error saving hotel:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.updateHotel = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

