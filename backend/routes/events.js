const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const { EventCreation, validationMiddleware } = require('../middleware/validation');

router.get('/all', authenticateToken, eventController.getAllEvents);
router.get('/:id', authenticateToken, eventController.getEventById);
router.post('/', authenticateToken, authorizeRoles(['admin']), validationMiddleware(EventCreation), eventController.createEvent);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), validationMiddleware(EventCreation), eventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), eventController.deleteEvent);


module.exports = router;