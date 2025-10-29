const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        
        let filter = { isAvailable: true };
        if (category && category !== 'all') {
            filter.category = category;
        }

        const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
        
        res.json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get single menu item
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get popular items
router.get('/featured/popular', async (req, res) => {
    try {
        const popularItems = await MenuItem.find({ 
            popular: true,
            isAvailable: true 
        }).limit(6);
        
        res.json({
            success: true,
            data: popularItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;