const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Warehouse = require('./models/Warehouse');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Receipt = require('./models/Receipt');
const DeliveryOrder = require('./models/DeliveryOrder');
const Location = require('./models/Location');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/coreinventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // DO NOT DELETE USERS
    await Product.deleteMany();
    await Category.deleteMany();
    await Warehouse.deleteMany();
    await Location.deleteMany();
    await Supplier.deleteMany();
    await Customer.deleteMany();
    await Receipt.deleteMany();
    await DeliveryOrder.deleteMany();

    // Recreate Bhavik if missing
    let bhavik = await User.findOne({ email: 'bhavik@gmail.com' });
    if (!bhavik) {
        bhavik = await User.create({
            full_name: 'Bhavik',
            email: 'bhavik@gmail.com',
            password: 'password123',
            role: 'manager'
        });
    }

    const cat1 = await Category.create({ name: 'Raw Materials', color: '#00D4AA' });
    const cat2 = await Category.create({ name: 'Finished Goods', color: '#00BCD4' });
    const cat3 = await Category.create({ name: 'Packaging', color: '#8B5CF6' });
    const cat4 = await Category.create({ name: 'Spare Parts', color: '#FFB020' });
    const cat5 = await Category.create({ name: 'Chemicals', color: '#FF4444' });

    await Product.create({ name: 'Steel Rods', sku: 'STL-001', category_id: cat1._id, unit_of_measure: 'kg', cost_price: 85, selling_price: 120, reorder_level: 100 });
    await Product.create({ name: 'Office Chairs', sku: 'CHR-001', category_id: cat2._id, unit_of_measure: 'pcs', cost_price: 4500, selling_price: 7500, reorder_level: 10 });
    await Product.create({ name: 'Cardboard Boxes', sku: 'PKG-001', category_id: cat3._id, unit_of_measure: 'pcs', cost_price: 25, selling_price: 45, reorder_level: 200 });
    await Product.create({ name: 'Aluminum Sheets', sku: 'ALM-001', category_id: cat1._id, unit_of_measure: 'kg', cost_price: 210, selling_price: 290, reorder_level: 50 });
    await Product.create({ name: 'Ball Bearings', sku: 'SPR-001', category_id: cat4._id, unit_of_measure: 'pcs', cost_price: 150, selling_price: 220, reorder_level: 30 });
    await Product.create({ name: 'Copper Wire', sku: 'COP-001', category_id: cat1._id, unit_of_measure: 'kg', cost_price: 650, selling_price: 850, reorder_level: 25 });
    await Product.create({ name: 'Bubble Wrap', sku: 'PKG-002', category_id: cat3._id, unit_of_measure: 'meters', cost_price: 15, selling_price: 28, reorder_level: 50 });
    await Product.create({ name: 'Industrial Solvent', sku: 'CHM-001', category_id: cat5._id, unit_of_measure: 'liters', cost_price: 320, selling_price: 480, reorder_level: 10, is_active: false });
    await Product.create({ name: 'Standing Desks', sku: 'DSK-001', category_id: cat2._id, unit_of_measure: 'pcs', cost_price: 12000, selling_price: 18500, reorder_level: 5 });
    await Product.create({ name: 'Iron Bolts', sku: 'BLT-001', category_id: cat1._id, unit_of_measure: 'pcs', cost_price: 3, selling_price: 6, reorder_level: 500 });


    const wh1 = await Warehouse.create({ name: 'Main Warehouse', address: '123 Industrial Area, Mumbai', is_default: true, type: 'internal' });
    const wh2 = await Warehouse.create({ name: 'Production Floor', address: '456 Factory Lane, Pune', is_default: false, type: 'production' });
    const wh3 = await Warehouse.create({ name: 'Cold Storage', address: '789 Cold Zone, Delhi', is_default: false, type: 'internal' });

    await Location.create({ name: 'Rack A', warehouse_id: wh1._id, type: 'shelf' });
    await Location.create({ name: 'Rack B', warehouse_id: wh1._id, type: 'shelf' });
    await Location.create({ name: 'Shelf C1', warehouse_id: wh1._id, type: 'shelf' });
    await Location.create({ name: 'Shelf C2', warehouse_id: wh1._id, type: 'shelf' });

    await Supplier.create({ name: 'Steel Corp India', email: 'contact@steelcorp.in', phone: '+91-9876543210' });
    await Supplier.create({ name: 'Global Supplies Ltd', email: 'info@globalsupplies.com', phone: '+91-9876543211' });
    await Supplier.create({ name: 'Metro Packaging Co', email: 'sales@metropack.in', phone: '+91-9876543212' });
    await Customer.create({ name: 'Tata Manufacturing', email: 'procurement@tata.com', phone: '+91-9876543220' });
    await Customer.create({ name: 'Reliance Industries', email: 'supply@reliance.com', phone: '+91-9876543221' });

    console.log('Database seeded with mock data successfully (without deleting users)!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

connectDB().then(importData);
