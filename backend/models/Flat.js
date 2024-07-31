// models/Visitor.js
const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  purpose: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the tenant
  scheduledDate: { type: Date, required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { type: String, default: 'pending' } // pending, checked_in, checked_out
});

module.exports = mongoose.model('Visitor', VisitorSchema);
