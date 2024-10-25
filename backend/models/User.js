// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'tenant'], required: true },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat' }, // Reference to the flat occupied by the tenant
  familyMembers:[{
     name: { type: String, required: true },
    relation: { type: String, required: true }
   }], // Names of family members
  phoneNumber: { type: String },
  emergencyContact: { type: String },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }] // Paths or URLs to uploaded documents
});

module.exports = mongoose.model('User', UserSchema);
