const mongoose = require('mongoose');

const mpesaSchema = new mongoose.Schema({
    mpesa_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
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

const Mpesa = mongoose.model('Mpesa', mpesaSchema);

module.exports = Mpesa;
