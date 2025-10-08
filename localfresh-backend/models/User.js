const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  cart: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }]
});

userSchema.pre('save', async function(next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
