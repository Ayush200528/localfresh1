const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
require('dotenv').config();

const menuItems = [
    // SNACKS
    {
        name: "Misal Pav",
        description: "Spicy sprout curry topped with farsan & onion",
        price: 80,
        category: "snacks",
        image: "images/misal-pav.jpg",
        popular: true,
        ingredients: ["Sprouts", "Pav", "Farsan", "Onion", "Spices"]
    },
    {
        name: "Vada Pav",
        description: "Fried potato dumpling in pav with chutneys",
        price: 35,
        category: "snacks",
        image: "images/vada-pav.jpg",
        popular: true,
        ingredients: ["Potato", "Pav", "Chutney", "Spices"]
    },
    {
        name: "Pav Bhaji",
        description: "Butter-toasted pav with spicy mashed vegetables",
        price: 100,
        category: "snacks",
        image: "images/pav-bhaji.jpg",
        popular: true,
        ingredients: ["Mixed Vegetables", "Pav", "Butter", "Spices"]
    },
    {
        name: "Poha",
        description: "Flattened rice cooked with onion, mustard seeds & peanuts",
        price: 60,
        category: "snacks",
        image: "images/poha.jpg",
        ingredients: ["Poha", "Onion", "Peanuts", "Mustard Seeds"]
    },
    {
        name: "Sabudana Khichdi",
        description: "Tapioca pearls with peanuts and green chili",
        price: 90,
        category: "snacks",
        image: "images/sabudana-khichdi.jpg",
        ingredients: ["Sabudana", "Peanuts", "Green Chili", "Potato"]
    },
    {
        name: "Kanda Bhaji",
        description: "Crispy onion fritters",
        price: 50,
        category: "snacks",
        image: "images/kanda-bhaji.jpg",
        ingredients: ["Onion", "Gram Flour", "Spices"]
    },
    {
        name: "Thalipeeth",
        description: "Multi-grain flatbread served with curd",
        price: 80,
        category: "snacks",
        image: "images/thalipeeth.jpg",
        ingredients: ["Multi-grain Flour", "Spices", "Onion"]
    },
    {
        name: "Batata Vada",
        description: "Spicy potato balls deep fried in chickpea batter",
        price: 60,
        category: "snacks",
        image: "images/batata-vada.jpg",
        ingredients: ["Potato", "Chickpea Flour", "Spices"]
    },
    
    // MEALS
    {
        name: "Pithla Bhakri",
        description: "Gram flour curry with jowar bhakri",
        price: 120,
        category: "meals",
        image: "images/pithla-bhakri.jpg",
        popular: true,
        ingredients: ["Gram Flour", "Jowar Flour", "Spices"]
    },
    {
        name: "Maharashtrian Thali",
        description: "Complete meal with 5 different dishes, rice, and chapati",
        price: 180,
        category: "meals",
        image: "images/maharashtrian-thali.jpg",
        popular: true,
        ingredients: ["Rice", "Chapati", "Dal", "Vegetables", "Salad"]
    },
    {
        name: "Varhadi Rassa",
        description: "Spicy chicken curry from Vidarbha region",
        price: 160,
        category: "meals",
        image: "images/varhadi-rassa.jpg",
        ingredients: ["Chicken", "Spices", "Coconut", "Onion"]
    },
    {
        name: "Bharli Vangi",
        description: "Stuffed baby brinjals in peanut-coconut gravy",
        price: 140,
        category: "meals",
        image: "images/bharli-vangi.jpg",
        ingredients: ["Brinjal", "Peanuts", "Coconut", "Spices"]
    },
    
    // DESSERTS
    {
        name: "Modak",
        description: "Sweet steamed dumpling with coconut filling",
        price: 70,
        category: "desserts",
        image: "images/modak.jpg",
        popular: true,
        ingredients: ["Rice Flour", "Coconut", "Jaggery"]
    },
    {
        name: "Puran Poli",
        description: "Sweet flatbread stuffed with lentil and jaggery",
        price: 60,
        category: "desserts",
        image: "images/puran-poli.jpg",
        ingredients: ["Wheat Flour", "Chana Dal", "Jaggery", "Cardamom"]
    },
    {
        name: "Shrikhand",
        description: "Sweetened strained yogurt with cardamom and saffron",
        price: 80,
        category: "desserts",
        image: "images/shrikhand.jpg",
        ingredients: ["Yogurt", "Sugar", "Cardamom", "Saffron"]
    },
    {
        name: "Aamras",
        description: "Sweet mango pulp served with poori",
        price: 90,
        category: "desserts",
        image: "images/aamras.jpg",
        ingredients: ["Mango", "Sugar", "Cardamom"]
    },
    
    // DRINKS
    {
        name: "Solkadhi",
        description: "Refreshing kokum-coconut drink",
        price: 40,
        category: "drinks",
        image: "images/solkadhi.jpg",
        ingredients: ["Kokum", "Coconut", "Spices"]
    },
    {
        name: "Taak",
        description: "Spiced buttermilk with ginger and curry leaves",
        price: 30,
        category: "drinks",
        image: "images/taak.jpg",
        ingredients: ["Buttermilk", "Ginger", "Curry Leaves", "Spices"]
    },
    {
        name: "Kokum Sherbet",
        description: "Sweet and tangy kokum drink",
        price: 35,
        category: "drinks",
        image: "images/kokum-sherbet.jpg",
        ingredients: ["Kokum", "Sugar", "Cumin", "Black Salt"]
    },
    {
        name: "Masala Chai",
        description: "Traditional spiced Indian tea",
        price: 20,
        category: "drinks",
        image: "images/masala-chai.jpg",
        ingredients: ["Tea", "Milk", "Ginger", "Cardamom", "Spices"]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localbite');
        console.log('Connected to MongoDB');
        
        // Clear existing menu items
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');
        
        // Insert new menu items
        await MenuItem.insertMany(menuItems);
        console.log('Menu items seeded successfully');
        
        // Show counts by category
        const counts = await MenuItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        console.log('Menu items by category:', counts);
        
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();