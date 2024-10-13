
const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  lowStock: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

InventoryItemSchema.pre('save', function(next) {
  if (this.quantity < process.env.LOW_STOCK_THRESHOLD) {
    this.lowStock = true;
  } else {
    this.lowStock = false;
  }
  next();
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
