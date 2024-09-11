// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     product_id: {
//         type: Number,
//         unique: true, // Ensure uniqueness
//       },
//     product_title: {
//         type: String,
//         required: true
//     },
//     product_img: {
//         type: String,
//         required: true
//     },
//     product_price: {
//         type: Number,
//         required: true
//     },
//     product_company: {
//         type: String,
//         required: true
//     },
//     product_info: {
//         type: String,
//         required: true,
//         maxlength: 8000
//     },
//     product_inCart: {
//         type: Boolean,
//         default: false,
//         required: true
//     },
//     product_count: {
//         type: Number,
//         default: 0,
//         required: true
//     },
//     product_total: {
//         type: Number,
//         default: 0,
//         required: true
//     },
//     product_quantity: {
//         type: Number,
//         default: 0,
//         required: true
//     },
//     product_createdAt: {
//         type: Date,
//         default: Date.now,
//         required: true
//     },
//     product_updatedAt: {
//         type: Date,
//         default: Date.now,
//         required: true
//     }
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;




const mongoose = require('mongoose');

// Assuming the Counter model is already defined as follows:
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});
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
    product_company: {
        type: String,
        required: true
    },
    product_info: {
        type: String,
        required: true,
        maxlength: 8000
    },
    product_inCart: {
        type: Boolean,
        default: false,
        required: true
    },
    product_count: {
        type: Number,
        default: 0,
        required: true
    },
    product_total: {
        type: Number,
        default: 0,
        required: true
    },
    product_quantity: {
        type: Number,
        default: 0,
        required: true
    },
    product_createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    product_updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

productSchema.pre('save', async function (next) {
  // Check if the document is new and not an update
  if (!this.isNew) {
      return next(); // Skip if it's not a new document
  }

  try {
      // Increment the counter using the specific identifier 'pending_product_id'
      const counter = await Counter.findByIdAndUpdate(
          { _id: 'product_id' }, // The identifier used in the Counter model
          { $inc: { seq: 1 } },          // Increment the sequence by 1
          { new: true, upsert: true }    // Options: return updated doc and create if not exists
      );

      // Assign the incremented sequence number to `pending_product_id` of the document
      this.product_id = counter.seq;
      next(); // Proceed to save the document
  } catch (error) {
      next(error); // Pass the error to the next middleware
  }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
