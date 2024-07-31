// controllers/requestController.js

const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Create a new service request or complaint
exports.createRequest = async (req, res) => {
  try {
    const { type, details } = req.body;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    // Validate input data
    if (!type || !details) {
      return res.status(400).json({ success: false, message: 'Type and details are required.' });
    }

    // Create a new request
    const newRequest = new Request({
      type,
      details,
      tenant: tenantId,
      status: 'Pending', // Default status
      createdAt: Date.now(),
    });

    // Save to the database
    await newRequest.save();

    // Notify the admin about the new request
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      const notification = new Notification({
        user: admin._id,
        message: `New request from tenant ${req.user.name}: ${type}`,
        type: 'request',
        request: newRequest._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }

    res.status(201).json({ success: true, message: 'Request created successfully.', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all requests for a specific tenant (notifications)
exports.getRequestsForTenant = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    // Retrieve all requests for the tenant
    const requests = await Request.find({ tenant: tenantId }).sort({ createdAt: -1 }); // Sort by date descending

    // Retrieve notifications for the tenant
    const notifications = await Notification.find({ user: tenantId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all requests for admin (notifications)
exports.getRequestsForAdmin = async (req, res) => {
  try {
    // Retrieve all requests
    const requests = await Request.find().populate('tenant', 'name email').sort({ createdAt: -1 }); // Sort by date descending

    // Retrieve notifications for the admin
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Validate input data
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid request ID.' });
    }

    // Find and update the request status
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Notify the tenant about the status update
    const tenant = await User.findById(updatedRequest.tenant);
    if (tenant) {
      const notification = new Notification({
        user: tenant._id,
        message: `Your request (${updatedRequest.type}) status has been updated to ${status}.`,
        type: 'request',
        request: updatedRequest._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }

    // Notify the admin about the status update
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      const notification = new Notification({
        user: admin._id,
        message: `Request (${updatedRequest.type}) status updated to ${status}.`,
        type: 'request',
        request: updatedRequest._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }

    res.status(200).json({ success: true, message: 'Request status updated successfully.', request: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get request details by ID (for tenants and admins)
exports.getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid request ID.' });
    }

    const request = await Request.findById(requestId).populate('tenant', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Delete a request by ID
exports.deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid request ID.' });
    }

    // Find and delete the request
    const deletedRequest = await Request.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Notify the tenant about the request deletion
    const tenant = await User.findById(deletedRequest.tenant);
    if (tenant) {
      const notification = new Notification({
        user: tenant._id,
        message: `Your request (${deletedRequest.type}) has been deleted.`,
        type: 'request',
        request: deletedRequest._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }

    // Notify the admin about the request deletion
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      const notification = new Notification({
        user: admin._id,
        message: `Request (${deletedRequest.type}) has been deleted.`,
        type: 'request',
        request: deletedRequest._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }

    res.status(200).json({ success: true, message: 'Request deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get pending requests count (for admin dashboard)
exports.getPendingRequestsCount = async (req, res) => {
  try {
    const pendingRequestsCount = await Request.countDocuments({ status: 'Pending' });
    res.status(200).json({ success: true, count: pendingRequestsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get requests statistics (for admin dashboard)
exports.getRequestsStatistics = async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'Pending' });
    const completedRequests = await Request.countDocuments({ status: 'Completed' });
    const inProgressRequests = await Request.countDocuments({ status: 'In Progress' });

    res.status(200).json({
      success: true,
      statistics: {
        totalRequests,
        pendingRequests,
        completedRequests,
        inProgressRequests,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
