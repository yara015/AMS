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
// const multer = require('multer');

// // Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Routes for tenants
// router.get('/profile', verifyToken, authorizeTenant, getTenantProfile); // Note: Changed to getTenantProfile for tenant view
// router.put('/profile', verifyToken, authorizeTenant, updateTenantProfile);
// router.get('/requests', verifyToken, authorizeTenant, getTenantRequests);
 router.post('/requests', verifyToken, isTenant, submitRequest);
// router.get('/notifications', verifyToken, authorizeTenant, getTenantNotifications);
// router.get('/requests/:id', verifyToken, authorizeTenant, getRequestDetails);
// router.get('/payments', verifyToken, authorizeTenant, getPaymentHistory);
// router.post('/payments', verifyToken, authorizeTenant, makePayment);
// router.post('/documents', verifyToken, authorizeTenant, upload.single('file'), uploadDocument);
// router.get('/documents', verifyToken, authorizeTenant, getTenantDocuments);
// router.delete('/documents/:id', verifyToken, authorizeTenant, deleteDocument);
// router.get('/forums', verifyToken, authorizeTenant, getForums);
// router.post('/forums', verifyToken, authorizeTenant, createForumPost);
// router.get('/events', verifyToken, authorizeTenant, getEvents);
// router.post('/events/:id/rsvp', verifyToken, authorizeTenant, rsvpEvent);
// router.get('/resource-bookings', verifyToken, authorizeTenant, getResourceBookings);
// router.post('/resource-bookings', verifyToken, authorizeTenant, bookResource);
// router.post('/feedback', verifyToken, authorizeTenant, submitFeedback);
// router.get('/emergency-alerts', verifyToken, authorizeTenant, getEmergencyAlerts);
// router.get('/vacancies', verifyToken, authorizeTenant, getVacancies);
// router.put('/family-info', verifyToken, authorizeTenant, updateFamilyInfo);

// Admin routes
router.get('/tenants',verifyToken,isAdmin,getAllTenants);
// router.get('/tenants/:id', verifyToken, authorizeAdmin, getTenantProfile); // For admin to view tenant profiles
// router.put('/tenants/:id', verifyToken, authorizeAdmin, updateTenantProfile);
// router.delete('/tenants/:id', verifyToken, authorizeAdmin, (req, res) => { /* Implement delete logic here */ });
// router.get('/flats', verifyToken, authorizeAdmin, getAllFlats);
// router.get('/flats/:id', verifyToken, authorizeAdmin, getFlatDetails);
// router.post('/flats/assign', verifyToken, authorizeAdmin, assignTenantToFlat);

module.exports = router;
