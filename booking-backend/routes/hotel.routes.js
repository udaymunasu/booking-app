const express = require('express');
const hotelController = require('../controller/hotel.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/',auth, hotelController.createHotel);
router.put('/:id', auth, hotelController.updateHotel);
router.delete('/:id', auth, hotelController.deleteHotel);

module.exports = router;