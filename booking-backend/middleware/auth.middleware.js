const jwt = require('jsonwebtoken');
const User = require('../models/user.model');  // Adjust path as needed

const auth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header (Bearer <token>)
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // If no token is found, return 401 Unauthorized
        if (!token) {
            return res.status(401).json({ message: 'Authentication token required' });
        }

        // Verify the token using the same secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use the same secret

        // Find the user associated with the token's decoded userId
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user object to the request (req.user)
        req.user = user;
        req.token = token;  // Optionally, attach the token to the request

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;
