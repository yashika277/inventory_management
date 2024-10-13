
// models/Supplier.js
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
