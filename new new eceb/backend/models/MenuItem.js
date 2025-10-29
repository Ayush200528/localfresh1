const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['snacks', 'meals', 'desserts', 'drinks']
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        default: 15
    },
    popular: {
        type: Boolean,
        default: false
    },
    ingredients: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);