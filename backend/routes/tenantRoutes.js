const express = require('express');
const router = express.Router();
const {
  getAllTenants,
  getTenantProfile,
  updateTenantProfile,
  getTenantRequests,
  submitRequest,
  getTenantNotifications,
  getRequestDetails,
  getPaymentHistory,
  makePayment,
  uploadDocument,
  getTenantDocuments,
  deleteDocument,
  getForums,
  createForumPost,
  getEvents,
  rsvpEvent,
  getResourceBookings,
  bookResource,
  submitFeedback,
  getEmergencyAlerts,
  getVacancies,
  updateFamilyInfo,
  assignTenantToFlat,
  getAllFlats,
  getFlatDetails,
} = require('../controllers/tenantController');
const { verifyToken, isAdmin,isTenant } = require('../middleware/authMiddleware');
const { createPayment } = require('../controllers/paymentController');
const multer = require('multer');

// // Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// // Routes for tenants
router.get('/profile', verifyToken, isTenant, getTenantProfile); // Note: Changed to getTenantProfile for tenant view
router.put('/profile', verifyToken, isTenant, updateTenantProfile);
router.get('/requests', verifyToken, isTenant, getTenantRequests);
router.post('/requests', verifyToken, isTenant, submitRequest);
router.get('/notifications', verifyToken, isTenant, getTenantNotifications);
router.get('/requests/:id', verifyToken, isTenant, getRequestDetails);
router.get('/payments', verifyToken, isTenant, getPaymentHistory);
router.post('/payments', verifyToken, isTenant, createPayment);
router.post('/documents', verifyToken, isTenant,upload.single('file'), uploadDocument);
router.get('/documents', verifyToken,isTenant,getTenantDocuments);
router.delete('/documents/:id', verifyToken,isTenant, deleteDocument);
// router.get('/forums', verifyToken, isTenant, getForums);
// router.post('/forums', verifyToken,isTenant, createForumPost);
// router.get('/events', verifyToken, isTenant, getEvents);
// router.post('/events/:id/rsvp', verifyToken, isTenant, rsvpEvent);
// router.get('/resource-bookings', verifyToken, isTenant, getResourceBookings);
// router.post('/resource-bookings', verifyToken, isTenant, bookResource);
// router.post('/feedback', verifyToken, isTenant, submitFeedback);
// router.get('/emergency-alerts', verifyToken, isTenant, getEmergencyAlerts);
// router.get('/vacancies', verifyToken, isTenant, getVacancies);
// router.put('/family-info', verifyToken, isTenant, updateFamilyInfo);

// Admin routes
router.get('/tenants',verifyToken,isAdmin,getAllTenants);
// router.get('/tenants/:id', verifyToken, authorizeAdmin, getTenantProfile); // For admin to view tenant profiles
// router.put('/tenants/:id', verifyToken, authorizeAdmin, updateTenantProfile);
// router.delete('/tenants/:id', verifyToken, authorizeAdmin, (req, res) => { /* Implement delete logic here */ });
// router.get('/flats', verifyToken, authorizeAdmin, getAllFlats);
// router.get('/flats/:id', verifyToken, authorizeAdmin, getFlatDetails);
// router.post('/flats/assign', verifyToken, authorizeAdmin, assignTenantToFlat);

module.exports = router;
