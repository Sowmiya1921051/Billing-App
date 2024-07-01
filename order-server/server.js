const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the orderedList directory exists
const orderedListDir = path.join(__dirname, 'orderedList'); 
if (!fs.existsSync(orderedListDir)) {
  fs.mkdirSync(orderedListDir);
}

// Use cors middleware
app.use(cors());
 
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for handling file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'orderedList/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

const storageOrderedList = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'orderedList/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadOrderedList = multer({ storage: storageOrderedList });

// New multer configuration for 'uploads/'
const storageUploads = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadToUploads = multer({ storage: storageUploads });


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/billing_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Use auth routes
// app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);

// Define Dish model
const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  gstRate: { type: Number, default: 0.05 },
  priceWithGST: { type: Number, required: true },
  category: { type: String },
  subcategory: { type: String },
  imageUrl: { type: String },
  hidden: { type: Boolean, default: false } ,
  stock: { type: Number, default: 0 }
});

const Dish = mongoose.model('Dish', DishSchema);


// Define OrderList model
const OrderListSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: String, default: getCurrentDateTime },
  status: { type: String, enum: ['Ordered', 'Cancelled'], default: 'Ordered' },
  orders: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    gstPrice: { type: Number, required: true }
  }]
});

const OrderList = mongoose.model('OrderList', OrderListSchema);

const OrderSchema = new mongoose.Schema({
  items: Array,
  totalPrice: Number,
  status: { type: String, default: 'Pending' }
});

const Order = mongoose.model('Order', OrderSchema);

const TableOrderSchema = new mongoose.Schema({
  orders: [{
    name: String,
    quantity: Number,
    totalPrice: String,
    gstPrice: String
  }],
  tableNumber: Number,
  place: String,
  status: { type: String, default: 'Pending' }
});

const TableOrder = mongoose.model('TableOrder', TableOrderSchema);

app.use(express.json());

// POST endpoint to add a new order
app.post('/api/tableOrders', async (req, res) => {
  try {
    const { orders, tableNumber, place } = req.body;

    // Check if there's already a pending order for the table and place
    const existingOrder = await TableOrder.findOne({ tableNumber, place, status: 'Pending' });

    if (existingOrder) {
      // If an existing pending order is found, do not allow creation of a new one
      return res.status(400).json({ message: 'An active order already exists for this table and place' });
    }

    // Create a new table order
    const newTableOrder = new TableOrder({
      orders,
      tableNumber,
      place
    });

    await newTableOrder.save();

    res.status(200).json({ message: 'Order saved successfully', order: newTableOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tableOrders/addOrder', async (req, res) => {
  try {
    const { orders, tableNumber, place } = req.body;

    // Find the existing table order by table number and place
    const existingOrder = await TableOrder.findOne({ tableNumber, place });

    if (existingOrder && existingOrder.status === 'Pending') {
      // Update existing order by merging new orders with existing ones
      orders.forEach(newOrder => {
        const existingOrderIndex = existingOrder.orders.findIndex(order => order.name === newOrder.name);
        if (existingOrderIndex >= 0) {
          // If the order already exists, update the quantity and prices
          existingOrder.orders[existingOrderIndex].quantity += newOrder.quantity;
          existingOrder.orders[existingOrderIndex].totalPrice = (
            parseFloat(existingOrder.orders[existingOrderIndex].totalPrice) +
            parseFloat(newOrder.totalPrice)
          ).toFixed(2);
          existingOrder.orders[existingOrderIndex].gstPrice = (
            parseFloat(existingOrder.orders[existingOrderIndex].gstPrice) +
            parseFloat(newOrder.gstPrice)
          ).toFixed(2);
        } else {
          // If the order does not exist, add it to the orders array
          existingOrder.orders.push(newOrder);
        }
      });

      // Save the updated order
      await existingOrder.save();

      // Respond with success message and updated order
      res.status(200).json({ message: 'Order updated successfully', order: existingOrder });
    } else {
      // If no existing order is found or the existing order's status is not 'Pending', create a new one
      const newTableOrder = new TableOrder({
        orders,
        tableNumber,
        place,
        status: 'Pending'
      });

      // Save the new order
      await newTableOrder.save();

      // Respond with success message and new order
      res.status(200).json({ message: 'Order saved successfully', order: newTableOrder });
    }
  } catch (error) {
    // Handle errors
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET endpoint to fetch all table orders
app.get('/api/tableOrders', async (req, res) => {
  try {
    const tableOrders = await TableOrder.find();

    if (!tableOrders || tableOrders.length === 0) {
      return res.status(404).json({ message: 'No table orders found' });
    }

    const tableOrdersWithStatus = tableOrders.map(order => ({
      ...order.toObject(),
      status: order.status || null
    }));

    res.status(200).json(tableOrdersWithStatus);
  } catch (error) {
    console.error('Error fetching table orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tableOrders/addOrder', async (req, res) => {
  try {
    const { orders, tableNumber, place } = req.body;

    // Find the existing table order by table number and place
    let existingOrder = await TableOrder.findOne({ tableNumber, place });

    if (existingOrder) {
      // If an existing order is found, update it
      if (existingOrder.status === 'Pending') {
        // Update existing order by merging new orders with existing ones
        orders.forEach(newOrder => {
          const existingOrderIndex = existingOrder.orders.findIndex(order => order.name === newOrder.name);
          if (existingOrderIndex >= 0) {
            // If the order already exists, update the quantity and prices
            existingOrder.orders[existingOrderIndex].quantity += newOrder.quantity;
            existingOrder.orders[existingOrderIndex].totalPrice = (
              parseFloat(existingOrder.orders[existingOrderIndex].totalPrice) +
              parseFloat(newOrder.totalPrice)
            ).toFixed(2);
            existingOrder.orders[existingOrderIndex].gstPrice = (
              parseFloat(existingOrder.orders[existingOrderIndex].gstPrice) +
              parseFloat(newOrder.gstPrice)
            ).toFixed(2);
          } else {
            // If the order does not exist, add it to the orders array
            existingOrder.orders.push(newOrder);
          }
        });

        // Save the updated order
        existingOrder = await existingOrder.save();

        // Respond with success message and updated order
        res.status(200).json({ message: 'Order updated successfully', order: existingOrder });
      } else if (existingOrder.status === 'Completed') {
        // For completed orders, create a new order with the same tableNumber and place
        const newTableOrder = new TableOrder({
          orders,
          tableNumber,
          place,
          status: 'Completed' // Set status to 'Completed' for new orders
        });

        // Save the new order
        await newTableOrder.save();

        // Respond with success message and new order
        res.status(200).json({ message: 'New order added successfully', order: newTableOrder });
      }
    } else {
      // If no existing order is found, create a new one with 'Pending' status
      const newTableOrder = new TableOrder({
        orders,
        tableNumber,
        place,
        status: 'Pending' // Set status to 'Pending' for new orders
      });

      // Save the new order
      await newTableOrder.save();

      // Respond with success message and new order
      res.status(200).json({ message: 'New order added successfully', order: newTableOrder });
    }
  } catch (error) {
    // Handle errors
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/api/tableOrders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const tableOrder = await TableOrder.findByIdAndUpdate(id, { status }, { new: true });

    if (!tableOrder) {
      return res.status(404).json({ message: 'Table order not found' });
    }

    res.status(200).json(tableOrder);
  } catch (error) {
    console.error('Error updating table order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Stock schema
const stockSchema = new mongoose.Schema({
  name: String,
  price: Number,
  weight: Number,
});

const Stock = mongoose.model('Stock', stockSchema);

// Routes
app.post('/api/stock', async (req, res) => {
  const { name, price, weight } = req.body;

  if (!name || price == null || weight == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newStock = new Stock({ name, price, weight });

  try {
    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(500).json({ message: 'Error saving stock data', error });
  }
});

// GET route to fetch all stocks
app.get('/api/stock', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data', error });
  }
});

// Add this new route to update stock price
app.put('/api/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (price == null) {
    return res.status(400).json({ message: 'Price is required' });
  }

  try {
    const updatedStock = await Stock.findByIdAndUpdate(id, { price }, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock price', error });
  }
});




// Function to get current date and time in the desired format
function getCurrentDateTime() {
  let date_time = new Date();
  let date = ("0" + date_time.getDate()).slice(-2);
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
  let year = date_time.getFullYear();
  let hours = ("0" + date_time.getHours()).slice(-2);
  let minutes = ("0" + date_time.getMinutes()).slice(-2);
  let seconds = ("0" + date_time.getSeconds()).slice(-2);

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}



app.post('/api/orders', async (req, res) => {
  const { items, totalPrice } = req.body;

  const newOrder = new Order({
    items,
    totalPrice,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save order', error });
  }
});


app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update dish hidden status route
app.put('/api/dishes/:id/hidden', async (req, res) => {
  try {
    const dishId = req.params.id;
    const { hidden } = req.body;

    // Find the dish by ID and update the hidden status
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    dish.hidden = hidden;
    await dish.save();

    console.log('Dish hidden status updated successfully:', dish);
    res.json({ success: true, message: 'Dish hidden status updated successfully', dish });
  } catch (error) {
    console.error('Error updating dish hidden status:', error);
    res.status(500).json({ success: false, message: 'Error updating dish hidden status' });
  }
});

app.put('/api/dishes/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const dish = await Dish.findByIdAndUpdate(id, { originalPrice: price }, { new: true });

    if (!dish) {
      return res.status(404).send({ message: 'Dish not found' });
    }

    res.send(dish);
  } catch (error) {
    res.status(500).send({ message: 'Error updating dish price', error });
  }
});


app.put('/stock/:id/weight', async (req, res) => {
  try {
    const { id } = req.params;
    const { weight } = req.body;

    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    stock.weight = weight;
    await stock.save();

    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error updating weight', error });
  }
});

// Update order status route
app.put('/api/orderedList/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Find the order by ID
    const order = await OrderList.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update the order status 
    order.status = status;
    await order.save();

    console.log('Order status updated successfully:', order);
    res.json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Error updating order status' });
  }
});


// Routes
app.post('/api/dishes', uploadToUploads.single('image'), async (req, res) => {
  console.log('Request received:', req.body, req.file);
  try {
    const { name, originalPrice, gstRate = 0.05, category,subcategory,stock } = req.body;

    // Ensure originalPrice and gstRate are numbers
    const originalPriceNum = parseFloat(originalPrice);
    const gstRateNum = parseFloat(gstRate);

    if (isNaN(originalPriceNum) || isNaN(gstRateNum)) {
      throw new Error('Invalid original price or GST rate');
    }

    // Calculate price with GST
    const priceWithGST = originalPriceNum * (1 + gstRateNum);

    const imageUrl = req.file ? req.file.path : null;

    // Create a new Dish document with the category included
    const dish = new Dish({
      name,
      originalPrice: originalPriceNum,
      gstRate: gstRateNum,
      priceWithGST,
      imageUrl,
      category,
      subcategory,
      stock, // Ensure category is included
    });

    // Save the new dish document
    await dish.save();
    console.log('Dish added successfully:', dish);
    res.json({ success: true, message: 'Dish added successfully' });
  } catch (error) {
    console.error('Error adding dish:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// New route to handle order list image uploads
app.post('/api/orderedList', uploadOrderedList.single('image'), async (req, res) => {
  try {
    const { orders } = req.body; // Get orders from request body
    const parsedOrders = JSON.parse(orders); // Parse the orders

    const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Save the image URL and orders to the database
    const orderList = new OrderList({ imageUrl, orders: parsedOrders });
    await orderList.save();

    console.log('Order list image uploaded and saved to DB:', imageUrl);
    res.json({ success: true, message: 'Image uploaded and saved to DB successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading and saving order list image:', error);
    res.status(500).json({ success: false, message: 'Error uploading and saving image' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// GET all dishes
// GET all dishes that are not hidden
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find({ hidden: false }); // Fetch dishes that are not hidden
    res.json(dishes); // Send the fetched dishes as a JSON response
  } catch (error) {
    console.error('Error fetching dishes:', error); // Log any errors that occur during fetching
    res.status(500).json({ success: false, message: 'Error fetching dishes' }); // Send an error response if fetching fails
  }
});

// GET all dishes (including hidden) for admin view
app.get('/api/dishes/all', async (req, res) => {
  try {
    const dishes = await Dish.find(); // Fetch all dishes from the database
    res.json(dishes); // Send the fetched dishes as a JSON response
  } catch (error) {
    console.error('Error fetching dishes:', error); // Log any errors that occur during fetching
    res.status(500).json({ success: false, message: 'Error fetching dishes' }); // Send an error response if fetching fails
  }
});


// GET all order list images
app.get('/api/orderedList', async (req, res) => {
  try {
    const orderListImages = await OrderList.find(); // Fetch all order list images from the database
    res.json(orderListImages); // Send the fetched order list images as a JSON response
  } catch (error) {
    console.error('Error fetching order list images:', error); // Log any errors that occur during fetching
    res.status(500).json({ success: false, message: 'Error fetching order list images' }); // Send an error response if fetching fails
  }
});




// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Serve static files (images) from the 'orderedList' directory
app.use('/orderedList', express.static('orderedList'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
