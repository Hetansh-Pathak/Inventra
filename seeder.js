const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Warehouse = require('./models/Warehouse');
const Location = require('./models/Location');
const Category = require('./models/Category');
const Product = require('./models/Product');
const StockLevel = require('./models/StockLevel');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Receipt = require('./models/Receipt');
const DeliveryOrder = require('./models/DeliveryOrder');
const InternalTransfer = require('./models/InternalTransfer');
const StockAdjustment = require('./models/StockAdjustment');
const StockMove = require('./models/StockMove');
const ReorderRule = require('./models/ReorderRule');
const AuditLog = require('./models/AuditLog');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedData = async () => {
  try {
    await User.deleteMany();
    await Warehouse.deleteMany();
    await Location.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await StockLevel.deleteMany();
    await Supplier.deleteMany();
    await Customer.deleteMany();
    await Receipt.deleteMany();
    await DeliveryOrder.deleteMany();
    await InternalTransfer.deleteMany();
    await StockAdjustment.deleteMany();
    await StockMove.deleteMany();
    await ReorderRule.deleteMany();
    await AuditLog.deleteMany();

    const adminUser = await User.create({
      full_name: 'Rajesh Kumar',
      email: 'admin@coreinventory.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Database skeleton seed structures planted successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
