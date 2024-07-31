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
exports.validateVisitor = [
  body('name').notEmpty().withMessage('Visitor name is required.'),
  body('visitDate').notEmpty().withMessage('Visit date is required.'),
  body('flat').notEmpty().withMessage('Flat information is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
