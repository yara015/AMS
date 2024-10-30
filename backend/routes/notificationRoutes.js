const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const {verifyToken,isAdmin,isTenant}=require('../middleware/authMiddleware');
// Get all notifications for the authenticated user
router.get('/',verifyToken, notificationController.getNotifications);

// Create a new notification
//router.post('/', notificationController.createNotification);

// Delete a notification by ID
router.get('/id/:id',verifyToken, notificationController.getNotificationById);
router.delete('/:id', notificationController.deleteNotificationById);

// Mark a notification as read
router.put('/read/:id', notificationController.markAsRead);
router.put('/unread/:id', notificationController.markAsUnRead);

module.exports = router;
