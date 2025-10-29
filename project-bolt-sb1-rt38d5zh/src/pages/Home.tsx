import { Leaf, Truck, Heart, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: <Leaf className="text-green-600" size={40} />,
      title: 'Fresh Ingredients',
      description: 'Sourced directly from local farmers and suppliers in Panvel',
    },
    {
      icon: <Truck className="text-orange-600" size={40} />,
      title: 'Fast Delivery',
      description: 'Quick delivery to your doorstep within Panvel and nearby areas',
    },
    {
      icon: <Heart className="text-red-500" size={40} />,
      title: 'Local Love',
      description: 'Supporting local businesses and the community with every order',
    },
    {
      icon: <Clock className="text-blue-600" size={40} />,
      title: 'Open Daily',
      description: 'Available from 8 AM to 10 PM, every day of the week',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Local Taste,{' '}
                <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                  Local Heart
                </span>
              </h1>
              <p className="text-2xl text-gray-700 mb-4 font-medium">
                Fresh from Panvel!
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Experience authentic local flavors and fresh ingredients delivered straight to your door.
                Supporting our community, one delicious meal at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  onClick={() => onNavigate('menu')}
                  className="shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Order Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('about')}
                  className="transform hover:scale-105"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-green-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
              <img
                src="dist\assets\image\Gemini_Generated_Image_vws0havws0havws0.png"
                alt="Fresh Indian street food"
                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Local Fresh?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a delivery service. We're your connection to authentic local flavors
              and community values.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="p-6 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="/dist/assets/image/Gemini_Generated_Image_1gudpg1gudpg1gud.png"
              alt="Fresh spices"
              className="rounded-3xl shadow-xl w-full h-[350px] object-cover"
            />
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Fresh Ingredients, Authentic Taste
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Every dish is prepared with the finest local ingredients. From our signature street food
                to essential spices and groceries, we ensure quality and freshness in everything we deliver.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our commitment to supporting local farmers and suppliers means you get the best produce
                while helping strengthen the Panvel community.
              </p>
              <Button
                size="lg"
                onClick={() => onNavigate('menu')}
              >
                Explore Our Menu
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience Local Fresh?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community and discover the authentic flavors of Panvel. Order now and taste the difference!
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('menu')}
            className="shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Start Ordering
          </Button>
        </div>
      </section>
    </div>
  );
}
