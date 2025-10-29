const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        itemTotal: Number
    }],
    deliveryAddress: {
        name: String,
        phone: String,
        address: String,
        area: String,
        landmark: String
    },
    orderTotal: {
        subtotal: Number,
        deliveryFee: Number,
        tax: Number,
        discount: Number,
        finalAmount: Number
    },
    payment: {
        method: {
            type: String,
            enum: ['upi', 'cod', 'wallet', 'card'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String
    },
    status: {
        type: String,
        enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'placed'
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    estimatedDelivery: Date,
    specialInstructions: String
}, {
    timestamps: true
});

orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        this.orderId = 'LB' + Date.now().toString().slice(-8);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);