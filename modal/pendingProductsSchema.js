const mongoose = require('mongoose');

const pendingProductSchema = new mongoose.Schema({
    pending_product_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
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
    pending_product_company: {
        type: String,
        required: true
    },
    pending_product_info: {
        type: String,
        required: true,
        maxlength: 8000
    },
    pending_product_inCart: {
        type: Boolean,
        default: false,
        required: true
    },
    pending_product_count: {
        type: Number,
        default: 0,
        required: true
    },
    pending_product_total: {
        type: Number,
        default: 0,
        required: true
    },
    pending_product_quantity: {
        type: Number,
        default: 0,
        required: true
    },
    pending_product_email: {
        type: String,
        required: true
    },
    pending_product_createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    pending_product_updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const PendingProduct = mongoose.model('PendingProduct', pendingProductSchema);

module.exports = PendingProduct;





