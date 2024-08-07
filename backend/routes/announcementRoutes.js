const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { verify } = require('crypto');

// Create a new announcement (Admin only)
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  validationMiddleware.validateAnnouncement,
  announcementController.createAnnouncement
);

// Get all announcements
router.get('/', authMiddleware.verifyToken,announcementController.getAnnouncements);

// Get a single announcement by ID
router.get(
  '/:id',
  authMiddleware.verifyToken,
  announcementController.getAnnouncementById
);

// Update an announcement by ID (Admin only)
router.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  validationMiddleware.validateAnnouncement,
  announcementController.updateAnnouncement
);

// Delete an announcement by ID (Admin only)
router.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  announcementController.deleteAnnouncement
);
router.get('/announcements/Active',
    authMiddleware.verifyToken,
     announcementController.getActiveAnnouncementsForUser
);
router.get('/announcements/Completed',
    authMiddleware.verifyToken,
    announcementController.getCompletedAnnouncements
);
// Route to mark announcements as completed automatically
router.patch('/mark-completed', authMiddleware.verifyToken, authMiddleware.isAdmin, announcementController.markAsCompleted);

module.exports = router;
