const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, isAdmin, isTenant } = require('../middleware/authMiddleware');

// Get feedbacks for a specific tenant
router.get('/tenant',
     verifyToken,
      isTenant,
      feedbackController.getFeedback
);

// Get all feedbacks (admin only)
router.get('/', verifyToken, isAdmin, feedbackController.getFeedbackForAdmin);

// Submit new feedback
router.post('/', verifyToken, feedbackController.submitFeedback);

// Update feedback
router.put('/:feedback_id', verifyToken, feedbackController.updateFeedback);

// Delete feedback
router.delete('/:feedback_id', verifyToken, feedbackController.deleteFeedback);

module.exports = router;
