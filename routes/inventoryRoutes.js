// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router
  .route('/create')
  .get(inventoryController.getAllInventoryItems)
  .post(inventoryController.createInventoryItem);

router
  .route('/:id')
  .get(inventoryController.getInventoryItem)
  .put(inventoryController.updateInventoryItem)
  .delete(inventoryController.deleteInventoryItem);

router
  .route('/export')
  .get(inventoryController.exportInventoryToCSV);

router
  .route('/import')
  .post(upload.single('file'), inventoryController.importInventoryFromCSV);

module.exports = router;
