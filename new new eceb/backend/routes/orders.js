const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, specialInstructions } = req.body;
        
        let subtotal = 0;
        const orderItems = [];
        
        for (let item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem || !menuItem.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `Item ${item.name} is not available`
                });
            }
            
            const itemTotal = menuItem.price * item.quantity;
            subtotal += itemTotal;
            
            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
                itemTotal: itemTotal
            });
        }
        
        const deliveryFee = 30;
        const tax = subtotal * 0.05;
        const finalAmount = subtotal + deliveryFee + tax;
        
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            deliveryAddress,
            orderTotal: { subtotal, deliveryFee, tax, discount: 0, finalAmount },
            payment: { method: paymentMethod, status: paymentMethod === 'cod' ? 'completed' : 'pending' },
            specialInstructions,
            statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
            estimatedDelivery: new Date(Date.now() + 45 * 60000)
        });
        
        await order.save();
        await order.populate('user', 'name email phone');
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.menuItem', 'name image')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('items.menuItem', 'name image description');
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;