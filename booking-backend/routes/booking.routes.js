const express = require('express');
const bookingController = require('../controller/booking.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(auth);

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;