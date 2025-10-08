const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  paymentId: String,
  paymentMethod: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
