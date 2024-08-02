const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/BookingController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// Book a resource
router.post('/book', 
  authMiddleware.verifyToken, 
  validationMiddleware.validateBooking, 
  resourceController.bookResource
);

// Get all available resources
router.get('/available', 
  authMiddleware.verifyToken, 
  resourceController.getAvailableResources
);

// Get a single resource by ID
router.get('/:id', 
  authMiddleware.verifyToken, 
  resourceController.getResourceById
);

// Update a resource booking
router.put('/:id', 
  authMiddleware.verifyToken, 
  validationMiddleware.validateBooking, 
  resourceController.updateResourceBooking
);

// Cancel a resource booking
router.delete('/:id', 
  authMiddleware.verifyToken, 
  resourceController.cancelResourceBooking
);

module.exports = router;
