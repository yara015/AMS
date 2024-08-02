// controllers/resourceController.js
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

// Create a new resource
exports.createResource = async (req, res) => {
  try {
    const { name, description, availability } = req.body;

    // Validate input data
    if (!name || !availability || !Array.isArray(availability)) {
      return res.status(400).json({ success: false, message: 'Name, description, and availability are required.' });
    }

    const newResource = new Resource({
      name,
      description,
      availability
    });

    await newResource.save();

    res.status(201).json({ success: true, message: 'Resource created successfully.', resource: newResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json({ success: true, resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get a single resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resourceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    res.status(200).json({ success: true, resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Update a resource
exports.updateResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const { name, description, availability } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { name, description, availability },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    res.status(200).json({ success: true, message: 'Resource updated successfully.', resource: updatedResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ success: false, message: 'Invalid resource ID.' });
    }

    const deletedResource = await Resource.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    res.status(200).json({ success: true, message: 'Resource deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
exports.getBookedResources = async (req, res) => {
    try {
      // Find resources that have at least one booking with status 'booked'
      const bookedResources = await Resource.find({
        'bookings.status': 'booked'
      });
  
      // Check if any resources are found
      if (bookedResources.length === 0) {
        return res.status(404).json({ success: false, message: 'No booked resources found.' });
      }
  
      res.status(200).json({ success: true, bookedResources });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
    }
  };