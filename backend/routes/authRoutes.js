const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

// Register a new user
router.post('/register', 
   validationMiddleware.validateRegister, 
  authController.register
);

// Login a user
router.post('/login', 
   validationMiddleware.validateLogin, 
  authController.login
);

// Get current user profile
router.get('/profile', 
  authMiddleware.verifyToken, 
  authController.getProfile
);

// Update user profile
router.put('/profile', 
  authMiddleware.verifyToken,
  authController.updateProfile
);

// Change user password
router.put('/change-password', 
  authMiddleware.verifyToken, 
  authController.changePassword
);

// Logout a user
router.post('/logout', 
  authMiddleware.verifyToken, 
  authController.logout
);
router.post('/forgot-Password', 
  authController.forgotPassword
);
router.post('/reset-password', 

  authController.resetPassword
);
router.get('/getAllusers', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin,
  authController.getAllUsers
);
router.put('/delete-user', 
  authMiddleware.verifyToken, 
  authMiddleware.isAdmin,
  authController.deleteUser
);

module.exports = router;
