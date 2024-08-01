// controllers/eventController.js

const Event = require('../models/Event');
const mongoose = require('mongoose');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;

    // Validate input data
    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create a new event
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
    });

    // Save to the database
    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event created successfully.', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all events with pagination, search, and filtering by date
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
    const skip = (page - 1) * limit;
    
    // Build search and date range query
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ],
      ...(startDate && endDate ? { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {})
    };

    const events = await Event.find(query)
      .sort({ date: 1, time: 1 }) // Sort by date and time ascending
      .skip(skip)
      .limit(Number(limit));

    const totalEvents = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      events,
      pagination: {
        total: totalEvents,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    const eventId = req.params.id;

    // Validate input data
    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    // Find and update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, date: new Date(date), time, location },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.status(200).json({ success: true, message: 'Event updated successfully.', event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    // Find and delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const upcomingEvents = await Event.find({ date: { $gte: today } ,status: 'upcoming'}).sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, upcomingEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get past events
exports.getPastEvents = async (req, res) => {
  try {
    const today = new Date();
    const pastEvents = await Event.find({ date: { $lt: today } }).sort({ date: -1, time: -1 });

    res.status(200).json({ success: true, pastEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Search events
exports.searchEvents = async (req, res) => {
  try {
    const { search } = req.query;   
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };

    const events = await Event.find(searchQuery).sort({ date: 1, time: 1 });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
exports.rsvpEvent = async (req, res) => {
    try {
      const eventId = req.params.id;
      const tenantId = req.user.id; // Get the tenant ID from the authenticated user
  
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ success: false, message: 'Invalid event ID.' });
      }
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }
  
      if (event.attendees.includes(tenantId)) {
        return res.status(400).json({ success: false, message: 'You have already RSVPed to this event.' });
      }
  
      event.attendees.push(tenantId);
      await event.save();
  
      res.status(200).json({ success: true, message: 'RSVPed to the event successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
  