const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();  // Loads environment variables from .env file


const authRoutes = require('./routes/auth.routes');
const hotelRoutes = require('./routes/hotel.routes');
const bookingRoutes = require('./routes/booking.routes');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
