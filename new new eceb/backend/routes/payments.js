const express = require('express');
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: orderId
        };
        
        const razorpayOrder = await razorpay.orders.create(options);
        
        res.json({
            success: true,
            data: {
                id: razorpayOrder.id,
                currency: razorpayOrder.currency,
                amount: razorpayOrder.amount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Payment error',
            error: error.message
        });
    }
});

// Verify payment
router.post('/verify-payment', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            res.json({ success: true, message: 'Payment verified' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;