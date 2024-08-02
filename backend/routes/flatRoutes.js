const express = require('express');
const router = express.Router();
const { verifyToken,isAdmin } = require('../middleware/authMiddleware');
const {
  createFlat,
  getVacancies,
  updateFamilyInfo,
  assignTenantToFlat,
  getAllFlats,
  getFlatDetails
} = require('../controllers/flatController');

// Create a new flat (Admin use only)
router.post('/create', verifyToken, isAdmin, createFlat);

// Get vacant flats
router.get('/vacancies', verifyToken, getVacancies);

// Update tenant family information
router.put('/family', verifyToken,updateFamilyInfo);

// Assign a tenant to a flat (Admin use only)
router.post('/assign', verifyToken, isAdmin, assignTenantToFlat);

// Get all flats (Admin use only)
router.get('/all', verifyToken, isAdmin, getAllFlats);

// Get flat details by ID (Admin use only)
router.get('/:id', verifyToken, isAdmin, getFlatDetails);

module.exports = router;
