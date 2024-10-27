const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: { type: String },
    isAcAvailable: { type: Boolean, default: false },
    roomCapacity: { type: Number },
    isActive: { type: Boolean, default: true },
    roomTariff: { type: Number },
    extensionNo: { type: Number },
});

module.exports = mongoose.model('Room', roomSchema);
