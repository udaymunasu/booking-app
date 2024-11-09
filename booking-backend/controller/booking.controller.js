const Booking = require('../models/booking.model');
const Hotel = require('../models/hotel.model');

exports.createBooking = async (req, res) => {
    try {
        const { hotelId, roomType, checkIn, checkOut, guests } = req.body;

        // Ensure the check-out date is after the check-in date
        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date' });
        }

        // Find the hotel
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Find the room type in the hotel
        const roomTypeDetails = hotel.roomTypes.find(r => r.type === roomType);
        if (!roomTypeDetails) {
            return res.status(400).json({ message: 'Invalid room type' });
        }

        // Calculate the number of nights and the total price
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        if (nights <= 0) {
            return res.status(400).json({ message: 'Invalid date range. Please check the dates.' });
        }

        const totalPrice = nights * roomTypeDetails.price;

        // Create a new booking
        const booking = new Booking({
            user: req.user._id,  // Assuming the user is authenticated
            hotel: hotelId,      // Use the hotelId directly as it is already a string
            roomType,
            checkIn,
            checkOut,
            guests,
            totalPrice
        });

        console.log("booking", booking)
        // Save the booking to the database
        await booking.save();
        res.status(201).json(booking); // Send the created booking back in the response

    } catch (error) {
        console.error('Booking Creation Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
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
