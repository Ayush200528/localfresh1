import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Order {
  id: string;
  total_amount: number;
  payment_method: string;
  delivery_status: 'Preparing' | 'Out for Delivery' | 'Delivered';
  delivery_address: string;
  phone: string;
  created_at: string;
}

interface TrackingProps {
  onNavigate: (page: string) => void;
}

export function Tracking({ onNavigate }: TrackingProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Preparing':
        return {
          icon: <Package className="text-orange-600" size={32} />,
          color: 'orange',
          message: 'Your order is being prepared with fresh ingredients',
        };
      case 'Out for Delivery':
        return {
          icon: <Truck className="text-blue-600" size={32} />,
          color: 'blue',
          message: 'Your order is on the way to your doorstep',
        };
      case 'Delivered':
        return {
          icon: <CheckCircle className="text-green-600" size={32} />,
          color: 'green',
          message: 'Your order has been delivered successfully',
        };
      default:
        return {
          icon: <Clock className="text-gray-600" size={32} />,
          color: 'gray',
          message: 'Order status unknown',
        };
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'Preparing':
        return 33;
      case 'Out for Delivery':
        return 66;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to track your orders</p>
            <Button onClick={() => onNavigate('login')}>Login</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping!</p>
            <Button onClick={() => onNavigate('menu')}>Browse Menu</Button>
          </Card>
        </div>
      </div>
    );
  }

  const latestOrder = orders[0];
  const statusInfo = getStatusInfo(latestOrder.delivery_status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Order Tracking</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest Order</h2>
                  <p className="text-sm text-gray-600">
                    Order #{latestOrder.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                {statusInfo.icon}
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{getProgressPercentage(latestOrder.delivery_status)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-orange-500 to-green-600 transition-all duration-500`}
                    style={{ width: `${getProgressPercentage(latestOrder.delivery_status)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ['Preparing', 'Out for Delivery', 'Delivered'].includes(latestOrder.delivery_status)
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <Package size={20} className={
                      ['Preparing', 'Out for Delivery', 'Delivered'].includes(latestOrder.delivery_status)
                        ? 'text-green-600'
                        : 'text-gray-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(latestOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ['Out for Delivery', 'Delivered'].includes(latestOrder.delivery_status)
                      ? 'bg-green-100'
                      : latestOrder.delivery_status === 'Preparing'
                      ? 'bg-orange-100'
                      : 'bg-gray-100'
                  }`}>
                    <Truck size={20} className={
                      ['Out for Delivery', 'Delivered'].includes(latestOrder.delivery_status)
                        ? 'text-green-600'
                        : latestOrder.delivery_status === 'Preparing'
                        ? 'text-orange-600'
                        : 'text-gray-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Out for Delivery</p>
                    <p className="text-sm text-gray-600">
                      {latestOrder.delivery_status === 'Out for Delivery'
                        ? 'In progress'
                        : latestOrder.delivery_status === 'Delivered'
                        ? 'Completed'
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    latestOrder.delivery_status === 'Delivered'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <CheckCircle size={20} className={
                      latestOrder.delivery_status === 'Delivered'
                        ? 'text-green-600'
                        : 'text-gray-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">
                      {latestOrder.delivery_status === 'Delivered' ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg">
                <p className="text-gray-800 font-medium">{statusInfo.message}</p>
              </div>

              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="text-gray-900 font-medium text-right">{latestOrder.delivery_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900 font-medium">{latestOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900 font-medium">{latestOrder.payment_method}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-orange-600">₹{latestOrder.total_amount}</span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 h-[500px]">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Route</h3>
              <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30208.62394567!2d73.0977!3d19.0144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c24cce39457b%3A0x188d3e76febf7b05!2sPanvel%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Card>

            {orders.length > 1 && (
              <Card className="mt-6 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order History</h3>
                <div className="space-y-3">
                  {orders.slice(1, 4).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">₹{order.total_amount}</p>
                        <p className={`text-sm ${
                          order.delivery_status === 'Delivered' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {order.delivery_status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
