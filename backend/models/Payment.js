// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentType: { type: String, enum: ['rent', 'utility', 'maintenance'], required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  title: { type: String, required: true },
  file: { type: Buffer, required: true }, 
  fileType: { type: String, required: true }, 
});

module.exports = mongoose.model('Payment', PaymentSchema);
