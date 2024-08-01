// controllers/tenantController.js

const User = require('../models/User');
const Request = require('../models/Request');
// const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const Document = require('../models/Document');
// const Forum = require('../models/Forum');
// const Event = require('../models/Event');
// const ResourceBooking = require('../models/ResourceBooking');
// const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Get all tenants (Admin use only)
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await User.find({ role: 'tenant' }).select('-password').sort({ name: 1 }); // Sort by name
    res.status(200).json({ success: true, tenants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get tenant profile by ID (Admin use only)
exports.getTenantProfile = async (req, res) => {
  try {
    const tenantId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ success: false, message: 'Invalid tenant ID.' });
    }

    const tenant = await User.findById(tenantId).select('-password');
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    res.status(200).json({ success: true, tenant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update tenant profile
exports.updateTenantProfile = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user
    const { name, email, phoneNumber } = req.body;

    // Validate input data
    if (!name && !email && !phoneNumber) {
      return res.status(400).json({ success: false, message: 'At least one field is required to update.' });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    // Update tenant profile
    const updatedTenant = await User.findByIdAndUpdate(tenantId, updateData, { new: true }).select('-password');
    if (!updatedTenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.', tenant: updatedTenant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get tenant requests
exports.getTenantRequests = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    const requests = await Request.find({ tenant: tenantId }).sort({ date: -1 }); // Sort by date descending
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Submit a new request (for complaints or needs)
exports.submitRequest = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user
    const { title, description } = req.body;

    // Validate input data
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    // Create a new request
    const newRequest = new Request({
      tenant: tenantId,
      title,
      description,
      status: 'pending', // Default status
      date: Date.now(),
    });

    // Save to the database
    await newRequest.save();

    // Notify admin about the new request
    const admin = await User.findOne({ role: 'admin' }); // Assuming only one admin for simplicity
    if (admin) {
      const notification = new Notification({
        user: admin._id,
        message: `A new request "${title}" has been submitted by tenant ${req.user.name}.`,
        type: 'request',
        request: newRequest._id,
        createdAt: Date.now(),
      });
      await notification.save();
    }

    res.status(201).json({ success: true, message: 'Request submitted successfully.', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get notifications for the tenant
exports.getTenantNotifications = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    const notifications = await Notification.find({ user: tenantId }).sort({ createdAt: -1 }); // Sort by date descending
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get details of a specific request (for tenants)
exports.getRequestDetails = async (req, res) => {
  try {
    const requestId = req.params.id;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid request ID.' });
    }

    const request = await Request.findOne({ _id: requestId, tenant: tenantId });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found or access denied.' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get tenant's payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    const payments = await Payment.find({ tenant: tenantId }).sort({ date: -1 }); // Sort by date descending
    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Make a payment (for rent, utilities, etc.)
exports.makePayment = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user
    const { amount, description } = req.body;

    // Validate input data
    if (!amount || !description) {
      return res.status(400).json({ success: false, message: 'Amount and description are required.' });
    }

    // Create a new payment
    const newPayment = new Payment({
      tenant: tenantId,
      amount,
      description,
      date: Date.now(),
    });

    // Save to the database
    await newPayment.save();

    res.status(201).json({ success: true, message: 'Payment made successfully.', payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Upload a document (e.g., proof of payment)
exports.uploadDocument = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user
    const { title, description } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File is required.' });
    }

    const newDocument = new Document({
      tenant: tenantId,
      title,
      description,
      file: req.file.path, // Path to the uploaded file
      date: Date.now(),
    });

    // Save the document to the database
    await newDocument.save();

    res.status(201).json({ success: true, message: 'Document uploaded successfully.', document: newDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all documents for a tenant
exports.getTenantDocuments = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    const documents = await Document.find({ tenant: tenantId }).sort({ date: -1 }); // Sort by date descending
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Delete a document by ID
exports.deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ success: false, message: 'Invalid document ID.' });
    }

    const document = await Document.findOneAndDelete({ _id: documentId, tenant: tenantId });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    res.status(200).json({ success: true, message: 'Document deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// // Community forums
// exports.getForums = async (req, res) => {
//   try {
//     const forums = await Forum.find({}).sort({ createdAt: -1 }); // Sort by date descending
//     res.status(200).json({ success: true, forums });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// exports.createForumPost = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const tenantId = req.user.id; // Get the tenant ID from the authenticated user

//     if (!title || !content) {
//       return res.status(400).json({ success: false, message: 'Title and content are required.' });
//     }

//     const newForumPost = new Forum({
//       tenant: tenantId,
//       title,
//       content,
//       createdAt: Date.now(),
//     });

//     await newForumPost.save();

//     res.status(201).json({ success: true, message: 'Forum post created successfully.', forumPost: newForumPost });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// Community events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 }); // Sort by date ascending
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.attendees.includes(tenantId)) {
      return res.status(400).json({ success: false, message: 'You have already RSVPed to this event.' });
    }

    event.attendees.push(tenantId);
    await event.save();

    res.status(200).json({ success: true, message: 'RSVPed to the event successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Resource booking (e.g., gym, community hall)
exports.getResourceBookings = async (req, res) => {
  try {
    const bookings = await ResourceBooking.find({}).sort({ date: 1 }); // Sort by date ascending
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

exports.bookResource = async (req, res) => {
  try {
    const { resourceId, date, time } = req.body;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    if (!resourceId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Resource ID, date, and time are required.' });
    }

    const newBooking = new ResourceBooking({
      tenant: tenantId,
      resourceId,
      date,
      time,
      createdAt: Date.now(),
    });

    await newBooking.save();

    res.status(201).json({ success: true, message: 'Resource booked successfully.', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Feedback and surveys
exports.submitFeedback = async (req, res) => {
  try {
    const { content } = req.body;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required.' });
    }

    const newFeedback = new Feedback({
      tenant: tenantId,
      content,
      createdAt: Date.now(),
    });

    await newFeedback.save();

    res.status(201).json({ success: true, message: 'Feedback submitted successfully.', feedback: newFeedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Emergency alerts
exports.getEmergencyAlerts = async (req, res) => {
  try {
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user

    const alerts = await Notification.find({ user: tenantId, type: 'emergency' }).sort({ createdAt: -1 }); // Sort by date descending
    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
// Get vacancies
exports.getVacancies = async (req, res) => {
    try {
      const flats = await Flat.find({ status: 'vacant' }).sort({ type: 1, floor: 1 }); // Sort by type and floor
      res.status(200).json({ success: true, flats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
// Update tenant family information
exports.updateFamilyInfo = async (req, res) => {
    try {
      const tenantId = req.user.id; // Get the tenant ID from the authenticated user
      const { family } = req.body;
  
      // Validate input data
      if (!family || !Array.isArray(family)) {
        return res.status(400).json({ success: false, message: 'Family information is required and should be an array.' });
      }
  
      // Update family information for the tenant
      const flat = await Flat.findOne({ tenant: tenantId });
      if (!flat) {
        return res.status(404).json({ success: false, message: 'Flat not found for the current tenant.' });
      }
  
      flat.family = family;
      await flat.save();
  
      res.status(200).json({ success: true, message: 'Family information updated successfully.', flat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
// Assign a tenant to a flat (Admin use only)
exports.assignTenantToFlat = async (req, res) => {
  try {
    const { flatId, tenantId, startDate } = req.body;

    // Validate input data
    if (!flatId || !tenantId || !startDate) {
      return res.status(400).json({ success: false, message: 'Flat ID, Tenant ID, and start date are required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(flatId) || !mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID(s) provided.' });
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      return res.status(404).json({ success: false, message: 'Flat not found.' });
    }

    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    flat.tenant = tenantId;
    flat.status = 'occupied';
    await flat.save();

    res.status(200).json({ success: true, message: 'Tenant assigned to flat successfully.', flat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
// Assign a tenant to a flat (Admin use only)
exports.assignTenantToFlat = async (req, res) => {
    try {
      const { flatId, tenantId, startDate } = req.body;
  
      // Validate input data
      if (!flatId || !tenantId || !startDate) {
        return res.status(400).json({ success: false, message: 'Flat ID, Tenant ID, and start date are required.' });
      }
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(flatId) || !mongoose.Types.ObjectId.isValid(tenantId)) {
        return res.status(400).json({ success: false, message: 'Invalid ID(s) provided.' });
      }
  
      const flat = await Flat.findById(flatId);
      if (!flat) {
        return res.status(404).json({ success: false, message: 'Flat not found.' });
      }
  
      const tenant = await User.findById(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found.' });
      }
  
      flat.tenant = tenantId;
      flat.status = 'occupied';
      await flat.save();
  
      res.status(200).json({ success: true, message: 'Tenant assigned to flat successfully.', flat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
// Get all flats with vacancy status (Admin use only)
exports.getAllFlats = async (req, res) => {
    try {
      const flats = await Flat.find().populate('tenant', 'name email'); // Populate tenant info
      res.status(200).json({ success: true, flats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
  
  // Get flat details by ID (Admin use only)
  exports.getFlatDetails = async (req, res) => {
    try {
      const flatId = req.params.id;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(flatId)) {
        return res.status(400).json({ success: false, message: 'Invalid flat ID.' });
      }
  
      const flat = await Flat.findById(flatId).populate('tenant', 'name email');
      if (!flat) {
        return res.status(404).json({ success: false, message: 'Flat not found.' });
      }
  
      res.status(200).json({ success: true, flat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };
        