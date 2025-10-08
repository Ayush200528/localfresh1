const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Sample products
const products = [
  {
    name: "Organic Veggie Box",
    price: 120,
    category: "grocery",
    img: "veggie_box.webp",
    description: "Fresh organic vegetables",
    stock: 20
  },
  {
    name: "Meal Kit: Pasta Primavera",
    price: 600,
    category: "meal",
    img: "meal_kit1.webp",
    description: "Ready-to-cook pasta kit",
    stock: 15
  },
  {
    name: "Fresh Fruit Basket",
    price: 110,
    category: "grocery",
    img: "fruit_basket.jpeg",
    description: "Seasonal fresh fruits",
    stock: 25
  },
  {
    name: "Meal Kit: Chicken Curry",
    price: 950,
    category: "meal",
    img: "chicken_curry.jpeg",
    description: "Spices and chicken ready-to-cook kit",
    stock: 10
  },
  {
    name: "Organic Eggs Dozen",
    price: 140,
    category: "grocery",
    img: "egg.jpeg",
    description: "Free-range organic eggs",
    stock: 30
  },
  {
    name: "Meal Kit: Tacos",
    price: 850,
    category: "meal",
    img: "taco.webp",
    description: "All ingredients to make tacos",
    stock: 12
  }
];

// Insert products
const seedDB = async () => {
  await Product.deleteMany(); // Optional: clears existing products
  await Product.insertMany(products);
  console.log("Products added successfully!");
  mongoose.connection.close();
};

seedDB();
