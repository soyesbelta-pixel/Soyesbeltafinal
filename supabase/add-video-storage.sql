-- Add video storage bucket for product videos
-- Run this SQL in your Supabase SQL Editor after the main schema

-- Storage bucket for product videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for videos
CREATE POLICY "Public read access to product videos bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-videos');

CREATE POLICY "Admin upload to product videos bucket" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-videos' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admin update product videos bucket" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-videos' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admin delete from product videos bucket" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-videos' AND
        auth.role() = 'authenticated'
    );
