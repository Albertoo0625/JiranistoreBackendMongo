const mongoose = require('mongoose');

// Create a schema for the counters collection
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

// Create a model for the counters collection
const Counter = mongoose.model('MpesaCounter', counterSchema);

// Define the mpesa schema
const mpesaSchema = new mongoose.Schema({
    mpesa_id: {
        type: Number,
        unique: true, // Ensure uniqueness
    },
    mpesa_number: {
        type: Number,
        required: true
    },
    mpesa_trnxid: {
        type: String,
        unique: true,
        required: true
    },
    mpesa_amount: {
        type: Number,
        required: true
    },
    mpesa_createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    mpesa_updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Middleware to auto-increment mpesa_id
mpesaSchema.pre('save', async function (next) {
  if (!this.isNew) {
    // Only run this middleware for new documents
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'mpesa_id' }, // Use a specific identifier for your counter
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.mpesa_id = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the Mpesa model
const Mpesa = mongoose.model('Mpesa', mpesaSchema);

module.exports = Mpesa;
