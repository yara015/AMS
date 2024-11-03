// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the tenant who uploaded the document
  title: { type: String, required: true }, // Title of the document
  description: { type: String }, // Description of the document
  file: { type: Buffer, required: true }, // Store the binary data directly
  fileType: { type: String, required: true }, // Path to the uploaded file
  date: { type: Date, default: Date.now }, // Date when the document was uploaded
});

module.exports = mongoose.model('Document', documentSchema);
