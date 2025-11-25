-- Virtual Try-On Products Schema
-- Manages products available in the virtual try-on feature

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active virtual try-on products" ON virtual_tryon_products;
DROP POLICY IF EXISTS "Authenticated users can manage virtual try-on products" ON virtual_tryon_products;

-- Virtual Try-On Products Table
CREATE TABLE IF NOT EXISTS virtual_tryon_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  display_image_url TEXT NOT NULL,
  reference_image_url TEXT NOT NULL,
  ai_prompt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_virtual_tryon_active ON virtual_tryon_products(is_active);
CREATE INDEX IF NOT EXISTS idx_virtual_tryon_order ON virtual_tryon_products(display_order);
CREATE INDEX IF NOT EXISTS idx_virtual_tryon_product ON virtual_tryon_products(product_id);

-- RLS Policies
ALTER TABLE virtual_tryon_products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public can view active virtual try-on products"
  ON virtual_tryon_products
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Authenticated users can manage virtual try-on products"
  ON virtual_tryon_products
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_virtual_tryon_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS virtual_tryon_updated_at ON virtual_tryon_products;

-- Trigger to automatically update updated_at
CREATE TRIGGER virtual_tryon_updated_at
  BEFORE UPDATE ON virtual_tryon_products
  FOR EACH ROW
  EXECUTE FUNCTION update_virtual_tryon_updated_at();

-- Storage bucket for virtual try-on images
INSERT INTO storage.buckets (id, name, public)
VALUES ('virtual-tryon-images', 'virtual-tryon-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public can view virtual try-on images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload virtual try-on images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update virtual try-on images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete virtual try-on images" ON storage.objects;

-- Storage policies
CREATE POLICY "Public can view virtual try-on images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'virtual-tryon-images');

CREATE POLICY "Authenticated users can upload virtual try-on images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'virtual-tryon-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update virtual try-on images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'virtual-tryon-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete virtual try-on images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'virtual-tryon-images' AND auth.uid() IS NOT NULL);
