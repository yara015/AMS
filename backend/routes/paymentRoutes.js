const express = require('express');
const multer = require('multer');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a payment (Tenants only)
router.post('/', 
  authMiddleware.verifyToken, 
  authMiddleware.isTenant,
  upload.single('file'),
  // validationMiddleware.validatePayment, 
  paymentController.createPayment
);

// Get all payment records (Admin only)
router.get('/all', 
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
router.get('/',
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
router.put('/updateStatus/:id',
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin,
  paymentController.updatePaymentStatusToCompleted
)

module.exports = router;
