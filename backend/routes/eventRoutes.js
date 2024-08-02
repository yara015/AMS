const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// Create a new event (Admin only)
router.post('/', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  validationMiddleware.validateEvent, 
  eventController.createEvent
);

// Get all events
router.get('/', 
    authMiddleware.verifyToken,
    eventController.getEvents
);

// Get a single event by ID
router.get('/:id', 
  authMiddleware.verifyToken,
  eventController.getEventById
);
//get Upcoming Events
router.get('/events/upcomingEvents',authMiddleware.verifyToken,eventController.getUpcomingEvents);

  //get Past Events
router.get('/events/getPastEvents', 
    authMiddleware.verifyToken,
    eventController.getPastEvents
  );

// Update an event by ID (Admin only)
router.put('/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  validationMiddleware.validateEvent, 
  eventController.updateEvent
);
//search events
router.get('/events/searchEvents', 
    authMiddleware.verifyToken,
    eventController.searchEvents
  );


// Delete an event by ID (Admin only)
router.delete('/events/deleteEvent/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  eventController.deleteEvent
);

// RSVP to an event (Authenticated users)
router.post('/:id/rsvp', 
  authMiddleware.verifyToken,  
  eventController.rsvpEvent
);

module.exports = router;
