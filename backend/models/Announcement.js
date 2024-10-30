// models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
