const mongoose = require('mongoose');
const Flat = require('../models/Flat');
const User = require('../models/User');

// Create a new flat (Admin use only)
exports.createFlat = async (req, res) => {
  try {
    const { type, floor, number } = req.body;

    // Validate input data
    if (!type || !floor || !number) {
      return res.status(400).json({ success: false, message: 'Type, floor, and number are required.' });
    }

    const newFlat = new Flat({
      type,
      floor,
      number,
      status: 'vacant' // Default status to 'vacant'
    });

    await newFlat.save();

    res.status(201).json({ success: true, message: 'Flat created successfully.', flat: newFlat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get vacant flats
exports.getVacancies = async (req, res) => {
  try {
    const flats = await Flat.find({ status: 'vacant' }).sort({ type: 1, floor: 1 });
    res.status(200).json({ success: true, flats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// // Update tenant family information
// exports.updateFamilyInfo = async (req, res) => {
//   try {
//     const tenantId = req.user.id;
//     const { family } = req.body;

//     if (!family || !Array.isArray(family)) {
//       return res.status(400).json({ success: false, message: 'Family information is required and should be an array.' });
//     }

//     const flat = await Flat.findOne({ tenant: tenantId });
//     if (!flat) {
//       return res.status(404).json({ success: false, message: 'Flat not found for the current tenant.' });
//     }

//     flat.family = family;
//     await flat.save();

//     res.status(200).json({ success: true, message: 'Family information updated successfully.', flat });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
//   }
// };

// Assign a tenant to a flat (Admin use only)
exports.assignTenantToFlat = async (req, res) => {
  try {
    const { flatId, tenantId } = req.body;
    const startDate=Date.now();

    if (!flatId || !tenantId || !startDate) {
      return res.status(400).json({ success: false, message: 'Flat ID, Tenant ID, and start date are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(flatId) || !mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID(s) provided.' });
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      return res.status(404).json({ success: false, message: 'Flat not found.' });
    }

    if (flat.status !== 'vacant') {
        return res.status(400).json({ success: false, message: 'The flat is not vacant.' });
      }
  
      // Find the tenant
      const tenant = await User.findById(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: 'Tenant not found.' });
      }
  
      // Find the current flat of the tenant, if any
      const currentFlat = await Flat.findOne({ tenant: tenantId });
      if (currentFlat) {
        // Make the current flat vacant
        currentFlat.status = 'vacant';
        currentFlat.tenant = null;
        await currentFlat.save();
      }

    flat.tenant = tenantId;
    flat.status = 'occupied';
    await flat.save();

    res.status(200).json({ success: true, message: 'Tenant assigned to flat successfully.', flat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get all flats with vacancy status (Admin use only)
exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find().populate('tenant');
    res.status(200).json({ success: true, flats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};

// Get flat details by ID (Admin use only)
exports.getFlatDetails = async (req, res) => {
  try {
    const flatId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(flatId)) {
      return res.status(400).json({ success: false, message: 'Invalid flat ID.' });
    }

    const flat = await Flat.findById(flatId).populate('tenant', 'name email');
    if (!flat) {
      return res.status(404).json({ success: false, message: 'Flat not found.' });
    }

    res.status(200).json({ success: true, flat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error });
  }
};
