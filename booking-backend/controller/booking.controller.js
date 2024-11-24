const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');
const sharp = require('sharp');

exports.createBooking = async (req, res) => {
    try {
        const hotelData = req.body;
        
        // Process images if they exist
        if (hotelData.images && hotelData.images.length > 0) {
            const processedImages = await Promise.all(
                hotelData.images.map(async (base64Image) => {
                    // Remove data:image/jpeg;base64, prefix
                    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    
                    // Process image with Sharp
                    const processedBuffer = await sharp(imageBuffer)
                        .jpeg({ quality: 80, progressive: true })
                        .resize(1920, null, { // Max width 1920px, maintain aspect ratio
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .toBuffer();
                    
                    // Convert back to base64 for storage
                    return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
                })
            );
            
            hotelData.images = processedImages;
            console.log("hotelData", hotelData)
        }

        const hotel = new Hotel(hotelData);
        await hotel.save();

        res.status(201).json({
            success: true,
            data: hotel
        });
    } catch (error) {
        console.error('Hotel Creation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating hotel',
            error: error.message
        });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('hotel')
            .sort({ createdAt: -1 });
        res.json(bookings);
        console.log("bookings", bookings)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('hotel');

        console.log("booking", booking)

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot update cancelled booking' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            booking[key] = updates[key];
        });

        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
