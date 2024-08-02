const { body, param, validationResult } = require('express-validator');

// Validation middleware for user registration
exports.validateRegister = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role').isIn(['admin', 'tenant', 'manager']).withMessage('Invalid role.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for user login
exports.validateLogin = [
  body('email').isEmail().withMessage('Invalid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for announcements
exports.validateAnnouncement = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('content').notEmpty().withMessage('Content is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for payments
exports.validatePayment = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0.'),
  body('paymentType').isIn(['rent', 'utility', 'maintenance']).withMessage('Invalid payment type.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for requests
exports.validateRequest = [
  body('type').notEmpty().withMessage('Request type is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for resources
exports.validateResource = [
  body('name').notEmpty().withMessage('Resource name is required.'),
  body('type').notEmpty().withMessage('Resource type is required.'),
  body('availability').notEmpty().withMessage('Resource availability is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for tenants
exports.validateTenant = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email.'),
  body('flat').notEmpty().withMessage('Flat information is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for visitors
const User=require('../models/User');
exports.validateVisitor = [
  body('name').notEmpty().withMessage('Visitor name is required.'),
  body('scheduledDate').notEmpty().withMessage('Scheduled date is required.'),
  body('hostId').notEmpty().withMessage('Host information is required.'),
  // .custom(async (value, { host }) => {
  //   // Validate ObjectId
  //   if (!mongoose.Types.ObjectId.isValid(value)) {
  //     throw new Error('Invalid host ID format.');
  //   }
  //   // Check if the host exists
  //   const user = await User.findById(value);
  //   if (!user) {
  //     throw new Error('Host not found in the user list.');
  //   }
  //   return true;
  // }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];


exports.validateEvent = [
  body('title').notEmpty().withMessage('Event title is required'),
  body('date').isISO8601().withMessage('Invalid date format. Use ISO 8601 format (e.g., 2024-07-30T14:30:00Z)'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').optional(), // Set to optional if not required
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

exports.validateBooking = [
  body('resourceId')
    .notEmpty().withMessage('Resource ID is required.')
    .isMongoId().withMessage('Invalid Resource ID format.'),
  body('startTime')
    .notEmpty().withMessage('Start time is required.')
    .isISO8601().withMessage('Start time must be a valid ISO 8601 date.'),
  
  body('endTime')
    .notEmpty().withMessage('End time is required.')
    .isISO8601().withMessage('End time must be a valid ISO 8601 date.')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time.');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];