const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    amenities: [{
        type: String
    }],
    images: {
        type: [String], // This ensures images can be an array of strings
        validate: {
          validator: function(value) {
            // Check if value is a string or an array of strings
            return typeof value === 'string' || (Array.isArray(value) && value.every(v => typeof v === 'string'));
          },
          message: 'Images must be a string or an array of strings'
        }
      },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    roomTypes: [{
        type: {
            type: String,
        },
        price: {
            type: Number,
        },
        capacity: {
            type: Number,
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);