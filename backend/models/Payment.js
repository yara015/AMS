// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentType: { type: String, enum: ['rent', 'utility', 'maintenance'], required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  receipt: { type: String } // Path or URL to the payment receipt
});

module.exports = mongoose.model('Payment', PaymentSchema);
