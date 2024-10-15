
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/create',supplierController.createSupplier);
router.get('/getall', supplierController.getAllSuppliers);



router
  .route('/:id')
  .get(supplierController.getSupplier)
  .put(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

module.exports = router;
