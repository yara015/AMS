const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { verifyToken, isAdmin,isTenant} = require('../middleware/authMiddleware');
const { validateVisitor} = require('../middleware/validationMiddleware');
// Register a new visitor
router.post('/register', verifyToken,validateVisitor, visitorController.registerVisitor);

// Get all visitors (Admin use only)
router.get('/', verifyToken, isAdmin, visitorController.getAllVisitors);
//get all visitors of tenant
router.get('/myVisitors', verifyToken, isTenant, visitorController.getAllVisitorsByTenant);

// Get visitor details by ID (Admin use only)
router.get('/:id', verifyToken, isAdmin, visitorController.getVisitorById);

// Update visitor status (check-in/check-out)
router.put('/status', verifyToken, visitorController.updateVisitorStatus);

// Notify host about visitor arrival
router.post('/notify', verifyToken, visitorController.notifyHost);

// Schedule a visit (Tenant use)
router.post('/schedule', verifyToken, visitorController.scheduleVisit);

// Get visitor history (Tenant use)
router.get('/history', verifyToken, visitorController.getVisitorHistory);

// Handle emergency alerts
router.post('/emergency', verifyToken, isAdmin, visitorController.emergencyAlertByAdmin);

module.exports = router;
