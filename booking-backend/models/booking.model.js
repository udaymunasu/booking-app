const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
    },
    roomType: {
        type: String,
        required: true
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    guests: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);