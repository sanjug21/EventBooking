const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');
const { validationMiddleware, bookingValidation } = require('../middleware/validation');

router.get('/all', authenticateToken, bookingsController.getBookings);
router.post('/book', authenticateToken, validationMiddleware(bookingValidation), bookingsController.bookTicket);
router.patch('/cancel/:id', authenticateToken, bookingsController.cancelBooking);

module.exports = router;