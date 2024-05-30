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
  imageUrl: { type: String },
  hidden: { type: Boolean, default: false } ,
});

const Dish = mongoose.model('Dish', DishSchema);


// Define OrderList model
const OrderListSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: String, default: getCurrentDateTime },
  status: { type: String, enum: ['Ordered', 'Cancelled'], default: 'Ordered' } // Add status field with default value 'Ordered'
});

const OrderList = mongoose.model('OrderList', OrderListSchema);

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
    const { name, originalPrice, gstRate = 0.05, category } = req.body;

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
      category, // Ensure category is included
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
    const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Save the image URL to the database
    const orderList = new OrderList({ imageUrl });
    await orderList.save();

    console.log('Order list image uploaded and saved to DB:', imageUrl);
    res.json({ success: true, message: 'Image uploaded and saved to DB successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading and saving order list image:', error);
    res.status(500).json({ success: false, message: 'Error uploading and saving image' });
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
