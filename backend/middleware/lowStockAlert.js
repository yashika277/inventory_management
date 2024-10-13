
const InventoryItem = require('../models/InventoryItem');

const lowStockAlert = async (req, res, next) => {
  try {
    const lowStockItems = await InventoryItem.find({ quantity: { $lt: process.env.LOW_STOCK_THRESHOLD } });
    if (lowStockItems.length > 0) {
      console.warn('Low Stock Items:', lowStockItems);
      // Here, you can implement additional alerting mechanisms like sending emails
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = lowStockAlert;
