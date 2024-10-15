
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const errorHandler = require('./middleware/errorHandler');
const lowStockAlert = require('./middleware/lowStockAlert');

dotenv.config();

connectDB();

const app = express();

// Body parser
app.use(express.json());

// Low Stock Alert Middleware
app.use(lowStockAlert);

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);

// Error Handler Middleware
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send(
      "<center><h1>Inventory management</h1><br>Get Api <a href=https://github.com/yashika277/inventory_management.git target=_blank>Repository :Inventory management</a></center>"
    );
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
