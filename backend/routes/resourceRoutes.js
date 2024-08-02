const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const {verifyToken,isAdmin} = require('../middleware/authMiddleware');
const {validateResource} = require('../middleware/validationMiddleware'); // Optional: Middleware for validation

// Create a new resource
router.post('/', verifyToken, isAdmin, validateResource, resourceController.createResource);

// Get all resources
router.get('/resources', verifyToken, resourceController.getAllResources);

// Get a single resource by ID
router.get('/resources/:id', verifyToken, resourceController.getResourceById);

// Update a resource
router.put('/resources/:id', verifyToken, isAdmin, validateResource, resourceController.updateResource);

// Delete a resource
router.delete('/resources/:id', verifyToken, isAdmin, resourceController.deleteResource);

// Get all booked resources
router.get('/resources/booked', verifyToken, isAdmin, resourceController.getBookedResources);

module.exports = router;
