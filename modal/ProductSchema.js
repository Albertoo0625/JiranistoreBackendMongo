const mongoose = require('mongoose');

// Create a schema for the counters collection
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

// Create a model for the counters collection
const Counter = mongoose.model('ProductCounter', counterSchema);

// Define the product schema
const productSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    unique: true, // Ensure uniqueness
  },
  product_title: {
    type: String,
    required: true
  },
  product_img: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true
  },
  product_company : {
    type: String,
    required: true
  },
  product_info : {
    type: String,
    required: true
  },
  product_inCart:{
    type: Boolean,
    default: false
  },
  product_count:{
    type: Number,
    default: 0
  },
  product_total:{
    type: Number,
    default: 0
  },
  product_quantity:{
    type: Number,
    default: 0
  },
  pending_product_id:{
    type: Number,
    default: null,
  },
  product_createdAt: {
    type: Date,
    default: Date.now,
  },
  product_updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware to auto-increment product_id
productSchema.pre('save', async function (next) {
  if (!this.isNew) {
    // Only run this middleware for new documents
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'product_id' }, // Use a specific identifier for your counter
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.product_id = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
