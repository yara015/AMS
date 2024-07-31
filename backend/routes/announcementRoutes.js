// const express = require('express');
// const router = express.Router();
// const announcementController = require('../controllers/announcementController');
// const authMiddleware = require('../middleware/authMiddleware');
// const validationMiddleware = require('../middleware/validationMiddleware');

// // Create a new announcement (Admin only)
// router.post(
//   '/',
//   authMiddleware.verifyToken,
//   authMiddleware.isAdmin,
//   announcementController.createAnnouncement
// );

// // Get all announcements
// router.get('/', announcementController.getAnnouncements);

// // Get a single announcement by ID
// router.get(
//   '/:id',
//   // validationMiddleware.validateAnnouncementId,
//   announcementController.getAnnouncementById
// );

// // Update an announcement by ID (Admin only)
// router.put(
//   '/:id',
//   authMiddleware.verifyToken,
//   authMiddleware.isAdmin,
//   // validationMiddleware.validateUpdateAnnouncement,
//   announcementController.updateAnnouncement
// );

// // Delete an announcement by ID (Admin only)
// router.delete(
//   '/:id',
//   authMiddleware.verifyToken,
//   authMiddleware.isAdmin,
//   // validationMiddleware.validateAnnouncementId,
//   announcementController.deleteAnnouncement
// );

// module.exports = router;
