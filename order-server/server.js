const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Use cors middleware
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
