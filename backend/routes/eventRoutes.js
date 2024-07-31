// const express = require('express');
// const router = express.Router();
// const eventController = require('../controllers/eventController');
// const authMiddleware = require('../middleware/authMiddleware');
// const validationMiddleware = require('../middleware/validationMiddleware');

// // Create a new event (Admin only)
// router.post('/', 
//   authMiddleware.verifyToken, 
//   authMiddleware.isAdmin, 
//   // validationMiddleware.validateEvent, 
//   eventController.createEvent
// );

// // Get all events
// router.get('/', eventController.getEvents);

// // Get a single event by ID
// router.get('/:id', 
//   // validationMiddleware.validateEventId, 
//   eventController.getEventById
// );

// // Update an event by ID (Admin only)
// router.put('/:id', 
//   authMiddleware.verifyToken, 
//   authMiddleware.isAdmin, 
//   // validationMiddleware.validateEvent, 
//   // validationMiddleware.validateEventId, 
//   eventController.updateEvent
// );

// // Delete an event by ID (Admin only)
// router.delete('/:id', 
//   authMiddleware.verifyToken, 
//   authMiddleware.isAdmin, 
//   // validationMiddleware.validateEventId, 
//   eventController.deleteEvent
// );

// // RSVP to an event (Authenticated users)
// // router.post('/:id/rsvp', 
// //   authMiddleware.verifyToken, 
// //   // validationMiddleware.validateEventId, 
// //   eventController.rsvpToEvent
// // );

// module.exports = router;
