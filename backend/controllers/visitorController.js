// controllers/visitorController.js

const Visitor = require('../models/Visitor');
const User = require('../models/User');
const mongoose = require('mongoose');

// Register a new visitor
exports.registerVisitor = async (req, res) => {
  try {
    const { name, contact, purpose, hostId, scheduledDate } = req.body;

    // Validate input data
    if (!name || !contact || !purpose || !hostId || !scheduledDate) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(hostId)) {
      return res.status(400).json({ success: false, message: 'Invalid host ID.' });
    }

    // Check if host exists
    const host = await User.findById(hostId);
    if (!host) {
      return res.status(404).json({ success: false, message: 'Host not found.' });
    }

    // Create a new visitor record
    const newVisitor = new Visitor({
      name,
      contact,
      purpose,
      host:host,
      scheduledDate
    });

    // Save to the database
    await newVisitor.save();

    res.status(201).json({ success: true, message: 'Visitor registered successfully.', visitor: newVisitor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
exports.getAllVisitorsByTenant = async (req, res) => {
    try {
        const tenantId=req.user.id;
        const visitors = await Visitor.find({ host: tenantId }).populate('host', 'name email').sort({ scheduledDate: -1 });
      res.status(200).json({ success: true, visitors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
// Get all visitors (Admin use only)
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('host', 'name email').sort({ scheduledDate: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get visitor details by ID (Admin use only)
exports.getVisitorById = async (req, res) => {
  try {
    const visitorId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).json({ success: false, message: 'Invalid visitor ID.' });
    }

    const visitor = await Visitor.findById(visitorId).populate('host', 'name email');
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found.' });
    }

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update visitor status (check-in/check-out)
exports.updateVisitorStatus = async (req, res) => {
  try {
    const { visitorId, status } = req.body;

    // Validate input data
    if (!visitorId || !status) {
      return res.status(400).json({ success: false, message: 'Visitor ID and status are required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).json({ success: false, message: 'Invalid visitor ID.' });
    }

    // Find and update visitor status
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found.' });
    }

    // Update check-in/check-out time based on status
    if (status === 'checked_in') {
      visitor.checkInTime = Date.now();
    } else if (status === 'checked_out') {
      visitor.checkOutTime = Date.now();
    }

    visitor.status = status;
    await visitor.save();

    res.status(200).json({ success: true, message: `Visitor status updated to ${status}.`, visitor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Notify host about visitor arrival
exports.notifyHost = async (req, res) => {
  try {
    const { visitorId } = req.body;

    // Validate input data
    if (!visitorId) {
      return res.status(400).json({ success: false, message: 'Visitor ID is required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).json({ success: false, message: 'Invalid visitor ID.' });
    }

    const visitor = await Visitor.findById(visitorId).populate('host', 'name email');
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found.' });
    }

    // Notify the host (this can be an email, SMS, etc.)
    // For simplicity, we'll just log it to the console
    const hostId=visitor.host._id;
    const host = await User.findById(hostId);
      const notification = new Notification({
        user: hostId,
        message: `New vistor name ${visitor.name} and  ${visitor.purpose}`,
        type: 'visitor',
        request: visitor._id,
        createdAt: Date.now(),
      });
      await notification.save();
    
    console.log(`Notification: Your visitor ${visitor.name} has arrived.`);

    res.status(200).json({ success: true, message: 'Host notified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Schedule a visit (Tenant use)
exports.scheduleVisit = async (req, res) => {
  try {
    const { name, contact, purpose, scheduledDate } = req.body;
    const tenant = req.user;

    // Validate input data
    if (!name || !contact || !purpose || !scheduledDate) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create a new visitor record
    const newVisitor = new Visitor({
      name,
      contact,
      purpose,
      host: tenant,
      scheduledDate
    });

    // Save to the database
    await newVisitor.save();

    res.status(201).json({ success: true, message: 'Visit scheduled successfully.', visitor: newVisitor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get visitor history (Tenant use)
exports.getVisitorHistory = async (req, res) => {
  try {
    const tenant= req.user;
    const visitors = await Visitor.find({ host: tenant}).sort({ scheduledDate: -1 });
    res.status(200).json({ success: true, visitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Handle emergency alerts
exports.emergencyAlertByAdmin = async (req, res) => {
  try {
    const { alertMessage } = req.body;

    // Validate input data
    if (!alertMessage) {
      return res.status(400).json({ success: false, message: 'Alert message is required.' });
    }

    // Notify all admins or security (this can be an email, SMS, etc.)
    // For simplicity, we'll just log it to the console
    const admin = await User.findOne({ role: 'admin' });
    const tenantUsers = await User.find({ role: 'tenant' });
    for (const tenant of tenantUsers) {
      const notification = new Notification({
        user: admin._id,
        message: `Emergency Alert ${alertMessage}`,
        type: 'emergency',
        request: tenant._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }
    console.log(`Emergency Alert: ${alertMessage}`);

    res.status(200).json({ success: true, message: 'Emergency alert sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
