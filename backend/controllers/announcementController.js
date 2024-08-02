// controllers/announcementController.js

const Announcement = require('../models/Announcement');
const mongoose = require('mongoose');

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, visibleTo } = req.body;

    // Validate input data
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    // Create a new announcement
    const newAnnouncement = new Announcement({
      title,
      content,
      date: Date.now(),
      visibleTo: visibleTo || [], // Optional field specifying user roles or IDs that can view the announcement
      status: 'active' // Default status
    });

    // Save to the database
    await newAnnouncement.save();
    res.status(201).json({ success: true, message: 'Announcement created successfully.', announcement: newAnnouncement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all announcements with pagination, search, and filtering by status
exports.getAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ],
      ...(status && { status }) // Filter by status if provided
    };

    const announcements = await Announcement.find(searchQuery)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalAnnouncements = await Announcement.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      announcements,
      pagination: {
        total: totalAnnouncements,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get a single announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcementId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(announcementId)) {
      return res.status(400).json({ success: false, message: 'Invalid announcement ID.' });
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.status(200).json({ success: true, announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update an announcement by ID
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content, visibleTo, status } = req.body;
    const announcementId = req.params.id;

    // Validate input data
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(announcementId)) {
      return res.status(400).json({ success: false, message: 'Invalid announcement ID.' });
    }

    // Find and update the announcement
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      announcementId,
      { title, content, date: Date.now(), visibleTo, status: status || 'active' },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.status(200).json({ success: true, message: 'Announcement updated successfully.', announcement: updatedAnnouncement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Delete an announcement by ID
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(announcementId)) {
      return res.status(400).json({ success: false, message: 'Invalid announcement ID.' });
    }

    // Find and delete the announcement
    const deletedAnnouncement = await Announcement.findByIdAndDelete(announcementId);

    if (!deletedAnnouncement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.status(200).json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Mark an announcement as completed
exports.markAsCompleted = async (req, res) => {
    try {
      // Get all announcements that are due (date < now) and are not already completed
      const currentDate = Date.now();
  
      // Find announcements that need to be marked as completed
      const announcementsToUpdate = await Announcement.find({
        date: { $lt: currentDate },
        status: { $ne: 'completed' }
      });
  
      if (announcementsToUpdate.length === 0) {
        return res.status(200).json({ success: true, message: 'No announcements to mark as completed.' });
      }
  
      // Update announcements to 'completed'
      const updatedAnnouncements = await Announcement.updateMany(
        { _id: { $in: announcementsToUpdate.map(a => a._id) } },
        { status: 'completed' },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: `${updatedAnnouncements.nModified} announcements marked as completed successfully.`,
        announcements: updatedAnnouncements
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };

// Get completed announcements
exports.getCompletedAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'completed' }).sort({ date: -1 });
    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get active announcements visible to a specific role or user
exports.getActiveAnnouncementsForUser = async (req, res) => {
  try {
    const userRole = req.user.role; // Assuming req.user is populated by auth middleware

    // Find active announcements visible to the user's role or ID
    const announcements = await Announcement.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { visibleTo: { $in: [userRole] } }, // Role-based visibility
            { visibleTo: { $in: [req.user._id] } }, // User-specific visibility
            { visibleTo: { $exists: false } } // Public announcements (no visibility restrictions)
          ]
        }
      ]
    }).sort({ date: -1 });

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
