// models/Flat.js
const mongoose = require('mongoose');

const FlatSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  floor: { type: String, required: true},
  type: { type: String, enum: ['1BHK', '2BHK', '3BHK', 'penthouse'], required: true },
  status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // List of tenants in the flat
});

module.exports = mongoose.model('Flat', FlatSchema);
