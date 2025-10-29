import { useState } from 'react';
import { ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './Button';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Menu', page: 'menu' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-600 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xl">LF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Local Fresh
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigation(link.page)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600'
                } pb-1`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => handleNavigation('profile')}
                  className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <User size={20} />
                </button>
                <button
                  onClick={() => handleNavigation('cart')}
                  className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => signOut()}
                  className="hidden md:inline-flex"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => handleNavigation('login')}
              >
                Login
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigation(link.page)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${
                  currentPage === link.page
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            {user && (
              <>
                <button
                  onClick={() => handleNavigation('profile')}
                  className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
