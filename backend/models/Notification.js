// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user receiving the notification
  message: { type: String, required: true }, // The notification message
  type: { type: String, enum: ['request', 'complaint','maintenance','general', 'visitor'], required: true }, // Type of notification (e.g., request, general, visitor)
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: false }, // Optional reference to a specific request
  isRead: { type: Boolean, default: false }, // Status of whether the notification has been read
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the notification was created
});

module.exports = mongoose.model('Notification', notificationSchema);
