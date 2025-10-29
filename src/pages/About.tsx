import { Heart, Users, Leaf, Award } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  const values = [
    {
      icon: <Heart className="text-red-500" size={40} />,
      title: 'Community First',
      description: 'We believe in supporting local businesses, farmers, and suppliers to strengthen the Panvel community.',
    },
    {
      icon: <Leaf className="text-green-600" size={40} />,
      title: 'Fresh & Quality',
      description: 'Every ingredient is carefully selected for freshness and quality, ensuring the best taste in every bite.',
    },
    {
      icon: <Users className="text-blue-600" size={40} />,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We strive to provide exceptional service with every order.',
    },
    {
      icon: <Award className="text-orange-600" size={40} />,
      title: 'Authentic Taste',
      description: 'Traditional recipes and local flavors that bring the authentic taste of Panvel to your table.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">About Local Fresh</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bringing authentic local flavors and fresh ingredients to the heart of Panvel
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Local Fresh was born from a simple idea: to connect the people of Panvel with the
                  authentic flavors and fresh ingredients that make our region special. We saw how the
                  fast-paced modern life was taking people away from traditional local food and community values.
                </p>
                <p>
                  Our journey began in the vibrant streets of Panvel, where we discovered incredible local
                  vendors, farmers, and food artisans creating amazing products. We wanted to make these
                  treasures accessible to everyone, delivered right to your doorstep.
                </p>
                <p>
                  Today, we're proud to serve the Panvel community with a curated selection of authentic
                  street food and fresh groceries, all while supporting local businesses and keeping our
                  food traditions alive.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                alt="Local market"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} hover className="p-6 text-center">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-12 bg-gradient-to-br from-orange-50 to-green-50 border-2 border-orange-200">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                To celebrate and preserve the authentic flavors of Panvel while supporting local businesses
                and farmers. We're committed to making fresh, quality food accessible to everyone, fostering
                community connections, and keeping our food heritage alive for future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => onNavigate('menu')}
                >
                  Start Ordering
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('contact')}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </Card>

          <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-600 font-medium">Local Partners</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
              <p className="text-gray-600 font-medium">Orders Delivered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
