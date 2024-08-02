const express = require('express');
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Get feedbacks for a specific tenant (if applicable) personal
exports.getFeedback=async (req, res) => {
  try {
    const { tenant_id } = req.user.id;
    const tenantObjectId = new mongoose.Types.ObjectId(tenant_id);

    console.log('Fetching feedbacks for tenant_id:', tenantObjectId);

    const feedbacks = await Feedback.find({ tenant: tenantObjectId }).populate('tenant');
    console.log('Feedbacks fetched:', feedbacks);

    res.status(200).send(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).send({ error: error.message });
  }
};

// Get all feedbacks (admin only)
exports.getFeedbackForAdmin=async (req, res) => {
  try {
    console.log('Fetching all feedbacks');

    const feedbacks = await Feedback.find({}).populate('tenant');
    console.log('Feedbacks fetched:', feedbacks);

    res.status(200).send(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).send({ error: error.message });
  }
};

// Submit new feedback
exports.submitFeedback=async (req, res) => {
  try {
    const { content } = req.body;
    const tenantId = req.user.id; // Get the tenant ID from the authenticated user
    if (!content) {
      return res.status(400).send({ error: 'Content is required' });
    }

    const newFeedback = new Feedback({
      tenant: tenantId,
      content,
    });

    await newFeedback.save();
    res.status(201).send(newFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(400).send({ error: error.message });
  }
};

// Update feedback
exports.updatedFeedback=async (req, res) => {
  try {
    const { feedback_id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(feedback_id, req.body, { new: true }).populate('tenant');

    if (updatedFeedback) {
      res.status(200).send(updatedFeedback);
    } else {
      res.status(404).send({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).send({ error: error.message });
  }
};

// Delete feedback
exports.deleteFeedback=async (req, res) => {
  try {
    const { feedback_id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(feedback_id);
    if (feedback) {
      res.status(200).send({ message: 'Feedback deleted successfully' });
    } else {
      res.status(404).send({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).send({ error: error.message });
  }
};

//module.exports = router;
