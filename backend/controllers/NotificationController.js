const express = require('express');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

// GET all notifications for the authenticated user
exports.getNotifications=async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).populate('user request');
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: error.message });
    }
};

// POST a new notification
exports.createNotification=async (req, res) => {
    try {
        const { user, message, type, request } = req.body;

        if (!user || !message || !type) {
            return res.status(400).json({ success: false, message: 'User, message, and type are required.' });
        }

        const notification = new Notification({
            user,
            message,
            type,
            request
        });

        await notification.save();
        res.status(201).json({ success: true, message: 'Notification created successfully.', notification });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'Error creating notification.', error: error.message });
    }
};
//get Notification by id
exports.getNotificationById= async (req, res) => {
    try {
        const notification = await Notification.find({ _id: req.params.id});
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, notification});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: error.message });
    }
};

// DELETE a notification by ID
exports.deleteNotificationById= async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id});
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: error.message });
    }
};

// Mark a notification as read
exports.markAsRead=async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id},
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification marked as read', notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: error.message });
    }
};

