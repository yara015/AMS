// // controllers/resourceController.js

// const Resource = require('../models/Resource');
// const Booking = require('../models/Booking');
// const mongoose = require('mongoose');

// // Book a resource
// exports.bookResource = async (req, res) => {
//   try {
//     const { resourceId, startTime, endTime } = req.body;
//     const userId = req.user.id;

//     // Validate input data
//     if (!resourceId || !startTime || !endTime) {
//       return res.status(400).json({ success: false, message: 'Resource ID, start time, and end time are required.' });
//     }

//     // Check if the resource exists
//     const resource = await Resource.findById(resourceId);
//     if (!resource) {
//       return res.status(404).json({ success: false, message: 'Resource not found.' });
//     }

//     // Check if the resource is available during the requested time
//     const existingBookings = await Booking.find({
//       resourceId,
//       $or: [
//         { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: startTime } }] }
//       ]
//     });
    
//     if (existingBookings.length > 0) {
//       return res.status(400).json({ success: false, message: 'Resource is not available during the requested time.' });
//     }

//     // Create a new booking
//     const newBooking = new Booking({
//       resourceId,
//       userId,
//       startTime,
//       endTime,
//     });

//     // Save the booking
//     await newBooking.save();

//     res.status(201).json({ success: true, message: 'Resource booked successfully.', booking: newBooking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// // Get all available resources
// exports.getAvailableResources = async (req, res) => {
//   try {
//     // Get all resources
//     const resources = await Resource.find();

//     // Get current bookings
//     const bookings = await Booking.find({
//       $or: [
//         { startTime: { $lte: new Date() }, endTime: { $gte: new Date() } }
//       ]
//     });

//     // Filter out unavailable resources
//     const unavailableResourceIds = bookings.map(booking => booking.resourceId.toString());
//     const availableResources = resources.filter(resource => !unavailableResourceIds.includes(resource._id.toString()));

//     res.status(200).json({ success: true, availableResources });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// // Get a single resource by ID
// exports.getResourceById = async (req, res) => {
//   try {
//     const resourceId = req.params.id;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(resourceId)) {
//       return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
//     }

//     const resource = await Resource.findById(resourceId);
//     if (!resource) {
//       return res.status(404).json({ success: false, message: 'Resource not found.' });
//     }

//     res.status(200).json({ success: true, resource });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// // Update a resource booking
// exports.updateResourceBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const { startTime, endTime } = req.body;

//     // Validate input data
//     if (!startTime || !endTime) {
//       return res.status(400).json({ success: false, message: 'Start time and end time are required.' });
//     }

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
//     }

//     // Find and update the booking
//     const updatedBooking = await Booking.findByIdAndUpdate(
//       bookingId,
//       { startTime, endTime },
//       { new: true }
//     );

//     if (!updatedBooking) {
//       return res.status(404).json({ success: false, message: 'Booking not found.' });
//     }

//     res.status(200).json({ success: true, message: 'Booking updated successfully.', booking: updatedBooking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// // Cancel a resource booking
// exports.cancelResourceBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
//     }

//     // Find and delete the booking
//     const deletedBooking = await Booking.findByIdAndDelete(bookingId);

//     if (!deletedBooking) {
//       return res.status(404).json({ success: false, message: 'Booking not found.' });
//     }

//     res.status(200).json({ success: true, message: 'Booking canceled successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };
