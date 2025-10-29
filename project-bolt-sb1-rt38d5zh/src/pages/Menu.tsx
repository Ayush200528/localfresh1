import { useEffect, useState } from 'react';
import { Plus, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface Product {
  id: string;
  name: string;
  category: 'food' | 'grocery';
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

interface MenuProps {
  onNavigate: (page: string) => void;
}

export function Menu({ onNavigate }: MenuProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'food' | 'grocery'>('food');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const fetchFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setFavorites(new Set(data.map(f => f.product_id)));
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (favorites.has(productId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });

      setFavorites(prev => new Set(prev).add(productId));
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setAddingToCart(productId);
    await addToCart(productId);
    setTimeout(() => setAddingToCart(null), 1000);
  };

  const filteredProducts = products.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our delicious food and fresh groceries, all sourced locally from Panvel
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('food')}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'food'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Food
            </button>
            <button
              onClick={() => setActiveTab('grocery')}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'grocery'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grocery
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} hover className="flex flex-col">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <Heart
                      size={20}
                      className={favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{product.price}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id}
                      className="flex items-center space-x-1"
                    >
                      {addingToCart === product.id ? (
                        <span>Added!</span>
                      ) : (
                        <>
                          <Plus size={16} />
                          <span>Add</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
