// const express = require('express');
// const router = express.Router();
// const resourceController = require('../controllers/resourceController');
// const authMiddleware = require('../middleware/authMiddleware');
// const validationMiddleware = require('../middleware/validationMiddleware');

// // Book a resource
// router.post('/book', 
//   authMiddleware.authenticate, 
//   // validationMiddleware.validateResourceBooking, 
//   resourceController.bookResource
// );

// // Get all available resources
// router.get('/available', 
//   authMiddleware.authenticate, 
//   resourceController.getAvailableResources
// );

// // Get a single resource by ID
// router.get('/:id', 
//   authMiddleware.authenticate, 
//   resourceController.getResourceById
// );

// // Update a resource booking
// router.put('/:id', 
//   authMiddleware.authenticate, 
//   // validationMiddleware.validateResourceBooking, 
//   resourceController.updateResourceBooking
// );

// // Cancel a resource booking
// router.delete('/:id', 
//   authMiddleware.authenticate, 
//   resourceController.cancelResourceBooking
// );

// module.exports = router;
