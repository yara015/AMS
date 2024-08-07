// models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  availability: [{ type: Date }], // Array of available time slots
  bookings: [{
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startTime:{type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
  }]
});

module.exports = mongoose.model('Resource', ResourceSchema);