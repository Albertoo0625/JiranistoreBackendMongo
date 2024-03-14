const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
