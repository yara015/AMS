// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'tenant'], required: true },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat' }, // Reference to the flat occupied by the tenant
  familyMembers: [{ type: String }], // Names of family members
  phoneNumber: { type: String },
  emergencyContact: { type: String },
  documents: [{ type: String }] // Paths or URLs to uploaded documents
});

module.exports = mongoose.model('User', UserSchema);
