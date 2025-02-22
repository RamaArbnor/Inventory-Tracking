const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Import route files
const clientsRoutes = require('./routes/clients');
const inventoryRoutes = require('./routes/inventory');
const rentalsRoutes = require('./routes/rentals');
const inventoryHistoryRoutes = require('./routes/inventoryHistory');

// Set up endpoints
app.use('/clients', clientsRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/rentals', rentalsRoutes);
app.use('/inventory-history', inventoryHistoryRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Tracking API is running');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
