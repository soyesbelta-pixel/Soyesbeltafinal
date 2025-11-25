-- Supabase schema for product management
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('lenceria', 'realce', 'fajas', 'moldeadoras')),
  description TEXT,
  price INTEGER NOT NULL CHECK (price > 0),
  original_price INTEGER GENERATED ALWAYS AS (ROUND((price / 0.9)::numeric / 100) * 100) STORED,
  discount INTEGER DEFAULT 10 CHECK (discount >= 0 AND discount <= 100),
  rating DECIMAL(2,1) DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  is_hot BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  video_url TEXT,
  main_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product features table
CREATE TABLE IF NOT EXISTS product_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  feature_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product colors table
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color_name VARCHAR(50) NOT NULL,
  color_code VARCHAR(7),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID REFERENCES product_colors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product audit log
CREATE TABLE IF NOT EXISTS product_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_features_product_id ON product_features(product_id);
CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_color_id ON product_images(color_id);
CREATE INDEX idx_audit_log_product_id ON product_audit_log(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_audit_log ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Public read access for active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for product features" ON product_features
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM products WHERE id = product_features.product_id AND is_active = true)
    );

CREATE POLICY "Public read access for product sizes" ON product_sizes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM products WHERE id = product_sizes.product_id AND is_active = true)
    );

CREATE POLICY "Public read access for product colors" ON product_colors
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM products WHERE id = product_colors.product_id AND is_active = true)
    );

CREATE POLICY "Public read access for product images" ON product_images
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM products WHERE id = product_images.product_id AND is_active = true)
    );

-- Admin full access (you'll need to create admin role/users)
CREATE POLICY "Admin full access to products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to product features" ON product_features
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to product sizes" ON product_sizes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to product colors" ON product_colors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to product images" ON product_images
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read access to audit log" ON product_audit_log
    FOR SELECT USING (auth.role() = 'authenticated');

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access to product images bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload to product images bucket" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admin update product images bucket" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admin delete from product images bucket" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );
