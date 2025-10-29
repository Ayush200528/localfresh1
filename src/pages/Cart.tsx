import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

interface CartProps {
  onNavigate: (page: string) => void;
}

type PaymentMethod = 'COD' | 'UPI' | 'Card';

export function Cart({ onNavigate }: CartProps) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async () => {
    if (!address.trim() || !phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: cartTotal,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'COD' ? 'Pending' : 'Completed',
          delivery_address: address,
          phone: phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
        product_name: item.product.name,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await clearCart();
      setOrderPlaced(true);
      setTimeout(() => {
        onNavigate('tracking');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your cart and place orders</p>
            <Button onClick={() => onNavigate('login')}>Login</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Redirecting to tracking page...</p>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Button onClick={() => onNavigate('menu')}>Browse Menu</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">
                        ₹{item.product.price * item.quantity}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 ml-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card className="p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">₹{cartTotal}</span>
                </div>
              </div>

              {!showCheckout ? (
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'COD', label: 'Cash on Delivery', icon: <Banknote size={20} /> },
                        { value: 'UPI', label: 'UPI Payment', icon: <Smartphone size={20} /> },
                        { value: 'Card', label: 'Card Payment', icon: <CreditCard size={20} /> },
                      ].map((method) => (
                        <button
                          key={method.value}
                          onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === method.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {method.icon}
                          <span className="font-medium">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Delivery Address"
                    placeholder="Enter your full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />

                  <Input
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  <Button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowCheckout(false)}
                    className="w-full"
                  >
                    Back to Cart
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
