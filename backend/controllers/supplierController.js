// controllers/supplierController.js
const Supplier = require('../models/Supplier');

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Public
exports.createSupplier = async (req, res, next) => {
  try {
    const { name, contactEmail, phoneNumber } = req.body;

    const supplier = await Supplier.create({ name, contactEmail, phoneNumber });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
exports.getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Public
exports.getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Public
exports.updateSupplier = async (req, res, next) => {
  try {
    const { name, contactEmail, phoneNumber } = req.body;

    let supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    supplier.name = name || supplier.name;
    supplier.contactEmail = contactEmail || supplier.contactEmail;
    supplier.phoneNumber = phoneNumber || supplier.phoneNumber;

    await supplier.save();

    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Public
exports.deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await supplier.remove();
    res.status(200).json({ success: true, message: 'Supplier removed' });
  } catch (error) {
    next(error);
  }
};
