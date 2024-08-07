const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware=require('../middleware/validationMiddleware');
// Create a new service request or complaint (Tenants only)
router.post('/', 
  authMiddleware.verifyToken, 
  authMiddleware.isTenant,
  validationMiddleware.validateRequest,
  requestController.createRequest
);

// Get all requests for a specific tenant (notifications)
router.get('/tenant', 
  authMiddleware.verifyToken, 
  requestController.getRequestsForTenant
);

// Get all requests for admin (notifications)
router.get('/admin', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  requestController.getRequestsForAdmin
);

// Update request status (Admin only)
router.put('/:requestId/status', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  requestController.updateRequestStatus
);

// Get request details by ID (Tenants and Admins)
router.get('/id/:requestId', 
  authMiddleware.verifyToken, 
  requestController.getRequestById
);

// Delete a request by ID (Admin only)
router.delete('/delete/:requestId', 
  authMiddleware.verifyToken, 
  //authMiddleware.isAdmin, 
  requestController.deleteRequest
);

// Get pending requests count (for admin dashboard)
router.get('/admin/pending-count', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  requestController.getPendingRequestsCount
);

// Get requests statistics (for admin dashboard)
router.get('/admin/statistics', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  requestController.getRequestsStatistics
);

module.exports = router;
