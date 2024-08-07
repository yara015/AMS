const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// Create a payment (Tenants only)
router.post('/', 
  authMiddleware.verifyToken, 
  authMiddleware.isTenant,
  validationMiddleware.validatePayment, 
  paymentController.createPayment
);

// Get all payment records (Admin only)
router.get('/admin/all', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  paymentController.getAllPayments
);

// Get all payments by user ID (Tenant or Admin)
router.get('/user/:userId', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin,
  paymentController.getPaymentsByUser
);
router.get('/user',
  authMiddleware.verifyToken, 
  authMiddleware.isTenant,
  paymentController.getPaymentsOfUser
)
// Update a payment record by ID (Admin only)
router.put('/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  paymentController.updatePayment
);

// Delete a payment record by ID (Admin only)
router.delete('/:id', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin, 
  paymentController.deletePayment
);

// Get payment history for the current user (Tenants only)
router.get('/history', 
  authMiddleware.verifyToken, 
  paymentController.getPaymentHistory
);

module.exports = router;
