const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/receipts', require('./routes/receipt.routes'));
app.use('/api/deliveries', require('./routes/delivery.routes'));
app.use('/api/transfers', require('./routes/transfer.routes'));
app.use('/api/adjustments', require('./routes/adjustment.routes'));
app.use('/api/warehouses', require('./routes/warehouse.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
