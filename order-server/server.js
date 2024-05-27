const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'orderedList/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/billing_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define Dish model
const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  gstRate: { type: Number, default: 0.05 },
  priceWithGST: { type: Number, required: true },
  imageUrl: { type: String }
});

const Dish = mongoose.model('Dish', DishSchema);

// Define OrderList model
const OrderListSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const OrderList = mongoose.model('OrderList', OrderListSchema);

// Routes
app.post('/api/dishes', upload.single('image'), async (req, res) => {
  console.log('Request received:', req.body, req.file);
  try {
    const { name, originalPrice, gstRate = 0.05 } = req.body;

    // Ensure originalPrice and gstRate are numbers
    const originalPriceNum = parseFloat(originalPrice);
    const gstRateNum = parseFloat(gstRate);

    if (isNaN(originalPriceNum) || isNaN(gstRateNum)) {
      throw new Error('Invalid original price or GST rate');
    }

    // Calculate price with GST
    const priceWithGST = originalPriceNum * (1 + gstRateNum);

    const imageUrl = req.file ? req.file.path : null;

    const dish = new Dish({ name, originalPrice: originalPriceNum, gstRate: gstRateNum, priceWithGST, imageUrl });
    await dish.save();
    console.log('Dish added successfully:', dish);
    res.json({ success: true, message: 'Dish added successfully' });
  } catch (error) {
    console.error('Error adding dish:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// New route to handle order list image uploads
app.post('/api/orderedList', upload.single('image'), async (req, res) => {
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
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find(); // Fetch all dishes from the database
    res.json(dishes); // Send the fetched dishes as a JSON response
  } catch (error) {
    console.error('Error fetching dishes:', error); // Log any errors that occur during fetching
    res.status(500).json({ success: false, message: 'Error fetching dishes' }); // Send an error response if fetching fails
  }
});

// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Serve static files (images) from the 'orderedList' directory
app.use('/orderedList', express.static('orderedList'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
