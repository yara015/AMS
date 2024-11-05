// controllers/paymentController.js

const Payment = require('../models/Payment');
const User = require('../models/User');
const mongoose = require('mongoose');

//create new Payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, paymentType, date, status,title, } = req.body;
    const fileBuffer = req.file.buffer; 
    const fileType = req.file.mimetype;
    console.log(typeof(amount));
    console.log(amount);
    console.log(typeof(paymentType));
    console.log(status);
    console.log(title)
    console.log(paymentType)
    // Validate input data
    if (!amount || !paymentType || !date || !status || !title) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const userId=req.user.id;
    const tenant=await User.findById(userId);
    // Create a new payment record
    const newPayment = new Payment({
      tenant,
      amount,
      paymentType,
      date: new Date(date),
      status,
      title,
      file:fileBuffer, 
      fileType, 
    });

    // Save to the database
    await newPayment.save();
    res.status(201).json({ success: true, message: 'Payment record created successfully.', payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all payment records (Admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    // Build search and date range query
    const query = {
      $or: [
        { userId: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ],
      ...(startDate && endDate ? { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {})
    };

    const payments = await Payment.find(query)
      .sort({ date: -1 }) // Sort by date descending
      .skip(skip)
      .limit(Number(limit));

    const totalPayments = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        total: totalPayments,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get payments by user ID (Tenant or Admin)
exports.getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = req.user;

    // Check if the current user is an admin or the requested user
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }
    const tenant=User.findById(userId);
    const payments = await Payment.find({ tenant }).sort({ date: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
exports.getPaymentsOfUser = async (req, res) => {
  try {
    const tenant=req.user;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(tenant)) {
      return res.status(400).json({ success: false, message: 'Invalid user.' });
    }
    
    const payments = await Payment.find({tenant}).sort({ date: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update a payment record by ID
exports.updatePayment = async (req, res) => {
  try {
    const { amount, type, date, status } = req.body;
    const paymentId = req.params.id;

    // Validate input data
    if (!amount || !type || !date || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ success: false, message: 'Invalid payment ID.' });
    }

    // Find and update the payment record
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { amount, type, date: new Date(date), status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    res.status(200).json({ success: true, message: 'Payment record updated successfully.', payment: updatedPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Delete a payment record by ID
exports.deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ success: false, message: 'Invalid payment ID.' });
    }

    // Find and delete the payment record
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    res.status(200).json({ success: true, message: 'Payment record deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
exports.getPaymentHistory = async (req, res) => {
    try {
      const user = req.user;
      const payments = await Payment.find({tenant:user}).sort({ date: -1 });
      res.status(200).json({ success: true, payments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
  exports.updatePaymentStatusToCompleted = async (req, res) => {
    try {
      const paymentId = req.params.id;
      const {newstatus}=req.body;
      console.log(newstatus);
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return res.status(400).json({ success: false, message: 'Invalid payment ID.' });
      }
  
      // Find and update the payment record, setting status to "completed"
      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        { status:newstatus},
        { new: true }
      );
  
      if (!updatedPayment) {
        return res.status(404).json({ success: false, message: 'Payment record not found.' });
      }
  
      res.status(200).json({ success: true, message: 'Payment status updated to paid successfully.', payment: updatedPayment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };