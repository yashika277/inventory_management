// controllers/inventoryController.js
const InventoryItem = require('../models/InventoryItem');
const Supplier = require('../models/Supplier');
// const { parseCSV } = require('../utils/csvUtils');
const csv = require('fast-csv');
const fs = require('fs');
const { toCSV } = require('../utils/csvUtils');

// @desc    Create a new inventory item
// @route   POST /api/inventory
// @access  Public
exports.createInventoryItem = async (req, res, next) => {
  try {
    const { name, quantity, supplier } = req.body;

    // Validate supplier existence
    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists) {
      return res.status(400).json({ success: false, message: 'Supplier not found' });
    }

    const item = await InventoryItem.create({ name, quantity, supplier });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Public
exports.getAllInventoryItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.find().populate('supplier');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Public
exports.getInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findById(req.params.id).populate('supplier');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Public
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const { name, quantity, supplier } = req.body;

    // If supplier is being updated, validate it
    if (supplier) {
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        return res.status(400).json({ success: false, message: 'Supplier not found' });
      }
    }

    let item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    item.name = name || item.name;
    item.quantity = quantity !== undefined ? quantity : item.quantity;
    item.supplier = supplier || item.supplier;

    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Public
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    await item.remove();
    res.status(200).json({ success: true, message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export inventory data to CSV
// @route   GET /api/inventory/export
// @access  Public
// exports.exportInventoryToCSV = async (req, res, next) => {
//   try {
//     const items = await InventoryItem.find().populate('supplier');

//     // Check if items exist
//     if (!items || items.length === 0) {
//       return res.status(404).json({ success: false, message: 'No inventory items found' });
//     }

//     const csv = parseCSV (items);
//     res.header('Content-Type', 'text/csv');
//     res.attachment('inventory.csv');
//     return res.send(csv);
//   } catch (error) {
//     console.error('Error exporting inventory to CSV:', error); // Log the actual error
//     next(error);
//   }
// };
exports.exportInventoryToCSV = async (req, res, next) => {
  try {
    console.log('Received request to export inventory to CSV');

    const items = await InventoryItem.find().populate('supplier');
    console.log(`Found ${items.length} inventory items`);

    if (!items || items.length === 0) {
      console.warn('No inventory items found to export');
      return res.status(404).json({ success: false, message: 'No inventory items found' });
    }

    const csvString = toCSV(items);
    console.log('Converted inventory items to CSV');

    res.header('Content-Type', 'text/csv');
    res.attachment('inventory.csv');
    console.log('Sending CSV file as response');

    return res.send(csvString);
  } catch (error) {
    console.error('Error in exportInventoryToCSV:', error);
    next(error);
  }
};

// @desc    Import inventory data from CSV
// @route   POST /api/inventory/import
// @access  Public
exports.importInventoryFromCSV = async (req, res, next) => {
  // try {
  //   if (!req.file) {
  //     return res.status(400).json({ success: false, message: 'No file uploaded' });
  //   }

  //   const results = await parseCSV(req.file.path);

  //   // Implement bulk import/update logic here
  //   // For simplicity, assuming the CSV has fields: name, quantity, supplierEmail

  //   const csvItems = results; // Array of objects

  //   for (const csvItem of csvItems) {
  //     const { name, quantity, supplierEmail } = csvItem;

  //     // Find supplier by email
  //     const supplier = await Supplier.findOne({ contactEmail: supplierEmail });
  //     if (!supplier) {
  //       // Optionally, create a new supplier or skip
  //       continue;
  //     }

  //     // Upsert inventory item
  //     await InventoryItem.findOneAndUpdate(
  //       { name, supplier: supplier._id },
  //       { quantity },
  //       { upsert: true, new: true, setDefaultsOnInsert: true }
  //     );
  //   }

  //   res.status(200).json({ success: true, message: 'Import successful' });
  // } catch (error) {
  //   next(error);
  // }

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileRows = [];

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => next(error))
      .on('data', row => {
        fileRows.push(row);
      })
      .on('end', async () => {
        // Remove the uploaded file after processing
        fs.unlinkSync(filePath);

        try {
          // Map CSV rows to InventoryItem documents
          const inventoryItems = await Promise.all(
            fileRows.map(async (row) => {
              // Find or create supplier by contactEmail
              let supplier = await Supplier.findOne({ contactEmail: row.supplier_contactEmail });
              if (!supplier) {
                // Optionally create a new supplier
                supplier = await Supplier.create({
                  name: row.supplier_name,
                  contactEmail: row.supplier_contactEmail,
                  phoneNumber: row.supplier_phoneNumber
                });
              }

              return {
                name: row.name,
                quantity: parseInt(row.quantity, 10),
                price: parseFloat(row.price),
                supplier: supplier._id
              };
            })
          );

          // Insert inventory items
          await InventoryItem.insertMany(inventoryItems, { ordered: false });

          res.status(201).json({ success: true, message: 'CSV import successful', count: inventoryItems.length });
        } catch (insertError) {
          console.error('Error inserting inventory items:', insertError);
          res.status(500).json({ success: false, message: 'Error importing CSV data', error: insertError.message });
        }
      });
  } catch (error) {
    next(error);
  }
};
