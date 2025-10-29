import { Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-orange-50 to-green-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-600 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xl">LF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Local Fresh
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Bringing you authentic local flavors and fresh ingredients from the heart of Panvel.
              Supporting local farmers and businesses with every order.
            </p>
            <div className="flex items-center text-orange-600">
              <Heart size={20} className="fill-current" />
              <span className="ml-2 font-medium">Support local food and businesses</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Panvel, Maharashtra</li>
              <li>Phone: +91 98765 43210</li>
              <li>Email: hello@localfresh.com</li>
              <li className="pt-2">
                <span className="text-green-600 font-medium">Open Daily: 8 AM - 10 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Local Fresh. All rights reserved. Made with love in Panvel.</p>
        </div>
      </div>
    </footer>
  );
}
