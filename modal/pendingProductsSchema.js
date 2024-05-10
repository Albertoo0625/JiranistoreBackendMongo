// const mongoose = require('mongoose');

// const pendingProductSchema = new mongoose.Schema({
//     pending_product_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         auto: true,
//     },
//     pending_product_title: {
//         type: String,
//         required: true
//     },
//     pending_product_img: {
//         type: String,
//         required: true
//     },
//     pending_product_price: {
//         type: Number,
//         required: true
//     },
//     pending_product_company: {
//         type: String,
//         required: true
//     },
//     pending_product_info: {
//         type: String,
//         required: true,
//         maxlength: 8000
//     },
//     pending_product_inCart: {
//         type: Boolean,
//         default: false,
//         required: true
//     },
//     pending_product_count: {
//         type: Number,
//         default: 0,
//         required: true
//     },
//     pending_product_total: {
//         type: Number,
//         default: 0,
//         required: true
//     },
//     pending_product_quantity: {
//         type: Number,
//         default: 0,
//         required: true
//     },
//     pending_product_email: {
//         type: String,
//         required: true
//     },
//     pending_product_createdAt: {
//         type: Date,
//         default: Date.now,
//         required: true
//     },
//     pending_product_updatedAt: {
//         type: Date,
//         default: Date.now,
//         required: true
//     }
// });

// const PendingProduct = mongoose.model('PendingProduct', pendingProductSchema);

// module.exports = PendingProduct;






const mongoose = require('mongoose');

// Create a schema for the counters collection
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

// Create a model for the counters collection
const Counter = mongoose.model('PendingProductCounter', counterSchema);

// Define the pending product schema
const pendingProductSchema = new mongoose.Schema({
  pending_product_id: {
    type: Number,
    unique: true, // Ensure uniqueness
  },
  pending_product_title: {
    type: String,
    required: true
  },
  pending_product_img: {
    type: String,
    required: true
  },
  pending_product_price: {
    type: Number,
    required: true
  },
  pending_product_company : {
    type: String,
    required: true
  },
  pending_product_info : {
    type: String,
    required: true
  },
  pending_product_inCart:{
    type: Boolean,
    default: false
  },
  pending_product_count:{
    type: Number,
    default: 0
  },
  pending_product_total:{
    type: Number,
    default: 0
  },
  pending_product_quantity:{
    type: Number,
    default: 0
  },
  pending_product_user_id:{
    type: Number,
    allowNull:true
  },
  pending_product_email:{
    type: String,
    required: true
  },
  pending_product_approval_status:{
    type: Boolean,
    default: false
  },
  pending_product_createdAt: {
    type: Date,
    default: Date.now
  },
  pending_product_updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to auto-increment pending_product_id
pendingProductSchema.pre('save', async function (next) {
  if (!this.isNew) {
    // Only run this middleware for new documents
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'pending_product_id' }, // Use a specific identifier for your counter
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.pending_product_id = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the PendingProduct model
const PendingProduct = mongoose.model('PendingProduct', pendingProductSchema);

module.exports = PendingProduct;




