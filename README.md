# Inventory Management Backend

## Overview

This backend application manages inventory data, handles bulk data operations, and manages suppliers using Node.js, Express, and MongoDB.

## Features

1. **Inventory Management API**
   - CRUD operations for inventory items.
   - Linking each inventory item to a supplier.

2. **Supplier Management API**
   - CRUD operations for suppliers.

3. **Bulk Export/Import**
   - Export inventory data to CSV.
   - Import inventory data from CSV.

4. **Low Stock Alerts**
   - Marks items as "low stock" when quantities fall below a specified threshold.

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- CSV Parsing and Generation
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/inventory-backend.git
cd inventory-backend
