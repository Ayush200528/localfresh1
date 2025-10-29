/*
  # Local Fresh Database Schema
  
  ## Overview
  Complete database schema for Local Fresh food and grocery ordering platform.
  
  ## New Tables
  
  ### 1. profiles
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `phone` (text) - Contact number
  - `address` (text) - Delivery address
  - `city` (text) - City name (default: Panvel)
  - `pincode` (text) - Postal code
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. products
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `category` (text) - Either 'food' or 'grocery'
  - `description` (text) - Product description
  - `price` (integer) - Price in rupees
  - `image_url` (text) - Product image URL
  - `is_available` (boolean) - Stock availability
  - `created_at` (timestamptz) - Product creation timestamp
  
  ### 3. cart_items
  - `id` (uuid, primary key) - Cart item identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `product_id` (uuid, foreign key) - References products
  - `quantity` (integer) - Number of items
  - `created_at` (timestamptz) - Added to cart timestamp
  
  ### 4. orders
  - `id` (uuid, primary key) - Order identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `total_amount` (integer) - Total order cost in rupees
  - `payment_method` (text) - COD, UPI, or Card
  - `payment_status` (text) - Pending, Completed, Failed
  - `delivery_status` (text) - Preparing, Out for Delivery, Delivered
  - `delivery_address` (text) - Full delivery address
  - `phone` (text) - Contact number for delivery
  - `created_at` (timestamptz) - Order placement timestamp
  - `updated_at` (timestamptz) - Last status update
  
  ### 5. order_items
  - `id` (uuid, primary key) - Order item identifier
  - `order_id` (uuid, foreign key) - References orders
  - `product_id` (uuid, foreign key) - References products
  - `quantity` (integer) - Number of items ordered
  - `price` (integer) - Price at time of order
  - `product_name` (text) - Product name snapshot
  
  ### 6. favorites
  - `id` (uuid, primary key) - Favorite identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `product_id` (uuid, foreign key) - References products
  - `created_at` (timestamptz) - Favorited timestamp
  
  ## Security
  - Enable RLS on all tables
  - Users can only access their own cart, orders, and favorites
  - Products are publicly readable
  - Profiles are only accessible to the owner
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  address text,
  city text DEFAULT 'Panvel',
  pincode text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('food', 'grocery')),
  description text DEFAULT '',
  price integer NOT NULL CHECK (price >= 0),
  image_url text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount integer NOT NULL CHECK (total_amount >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('COD', 'UPI', 'Card')),
  payment_status text DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Completed', 'Failed')),
  delivery_status text DEFAULT 'Preparing' CHECK (delivery_status IN ('Preparing', 'Out for Delivery', 'Delivered')),
  delivery_address text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  price integer NOT NULL CHECK (price >= 0),
  product_name text NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial products data
INSERT INTO products (name, category, description, price, image_url) VALUES
  -- Food items
  ('Vada Pav', 'food', 'Classic Mumbai street food - spiced potato fritter in a bun', 20, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  ('Pav Bhaji', 'food', 'Spicy vegetable curry served with buttered bread rolls', 60, 'https://images.pexels.com/photos/6287518/pexels-photo-6287518.jpeg'),
  ('Misal Pav', 'food', 'Spicy sprout curry topped with farsan and served with pav', 50, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  ('Sev Puri', 'food', 'Crispy puris topped with potatoes, chutneys and sev', 30, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg'),
  ('Pani Puri', 'food', 'Crispy hollow puris filled with tangy tamarind water', 25, 'https://images.pexels.com/photos/3609856/pexels-photo-3609856.jpeg'),
  ('Bhel Puri', 'food', 'Puffed rice mixed with vegetables, chutneys and sev', 25, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg'),
  ('Puran Poli', 'food', 'Sweet flatbread stuffed with lentil and jaggery filling', 40, 'https://images.pexels.com/photos/8629149/pexels-photo-8629149.jpeg'),
  ('Poha', 'food', 'Flattened rice cooked with spices, curry leaves and peanuts', 25, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  ('Thalipeeth', 'food', 'Multi-grain savory pancake with spices', 35, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  ('Batata Wada', 'food', 'Deep-fried potato fritter with gram flour coating', 20, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  
  -- Grocery items
  ('Turmeric Powder', 'grocery', 'Pure turmeric powder - 100g pack', 30, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Red Chili Powder', 'grocery', 'Spicy red chili powder - 100g pack', 40, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Garam Masala', 'grocery', 'Aromatic blend of ground spices - 100g pack', 50, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Coriander Powder', 'grocery', 'Ground coriander seeds - 100g pack', 20, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Mustard Seeds', 'grocery', 'Black mustard seeds - 100g pack', 15, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Cumin Seeds', 'grocery', 'Whole cumin seeds - 100g pack', 25, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Curry Leaves', 'grocery', 'Fresh curry leaves - 1 bunch', 10, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Asafoetida (Hing)', 'grocery', 'Pure asafoetida powder - 50g pack', 35, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Tamarind', 'grocery', 'Seedless tamarind - 200g pack', 20, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg'),
  ('Kokum', 'grocery', 'Dried kokum for souring - 100g pack', 25, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg')
ON CONFLICT DO NOTHING;