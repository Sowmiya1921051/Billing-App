// models/MenuItem.js

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  category: String, // Category of the menu item (e.g., "dishes", "soupsAndDesserts", "drinks")
  name: String, // Name of the menu item
  price: Number, // Price of the menu item
  gst: Number, // GST rate for the menu item (e.g., 0.05 for 5% GST)
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
