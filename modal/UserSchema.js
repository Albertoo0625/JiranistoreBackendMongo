const mongoose = require('mongoose');

// Create a schema for the counters collection
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

// Create a model for the counters collection
const Counter = mongoose.model('UserCounter', counterSchema);

// Define the user schema
const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true, // Ensure uniqueness
  },
  user_username: {
    type: String,
    required: true,
  },
  user_roles: {
    type: Object,
    default: { User: 2001 },
  },
  user_password: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  user_refreshToken: {
    type: String,
    default: null,
  },
  user_createdAt: {
    type: Date,
    default: Date.now,
  },
  user_updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to auto-increment user_id
userSchema.pre('save', async function (next) {
  if (!this.isNew) {
    // Only run this middleware for new documents
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'user_id' }, // Use a specific identifier for your counter
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.user_id = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
