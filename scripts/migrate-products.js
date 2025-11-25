/**
 * Migration Script: Static Products → Supabase
 *
 * This script migrates existing products from products.js to Supabase database.
 * It uploads images to Supabase Storage and creates database records.
 *
 * Usage:
 *   node scripts/migrate-products.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Try service_role key first (for migration), fallback to anon key
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('For migration, you may need VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create client with service role to bypass RLS
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Import static products
const productsModule = await import('../src/data/products.js');
const staticProducts = productsModule.products;

console.log('🚀 Starting product migration...\n');
console.log(`Found ${staticProducts.length} products to migrate\n`);

// Helper function to upload image from public folder
async function uploadImageToSupabase(imagePath, productName, colorName) {
  try {
    // Remove leading slash and /public/ from path
    const cleanPath = imagePath.replace(/^\//, '').replace(/^public\//, '');
    const localPath = path.join(__dirname, '../public', cleanPath);

    // Check if file exists
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  Image not found: ${localPath}`);
      return null;
    }

    // Read file
    const fileBuffer = fs.readFileSync(localPath);

    // Generate storage path
    const sanitizedProductName = productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const sanitizedColorName = colorName.toLowerCase();
    const fileName = path.basename(cleanPath);
    const storagePath = `products/${sanitizedProductName}/${sanitizedColorName}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });

    if (error) {
      // If already exists, just get the URL
      if (error.message.includes('already exists')) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(storagePath);
        return urlData.publicUrl;
      }
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`  ❌ Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

// Migrate a single product
async function migrateProduct(product) {
  console.log(`📦 Migrating: ${product.name}`);

  try {
    // 1. Create product record
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        rating: product.rating || 4.8,
        reviews: product.reviews || 0,
        stock: product.stock || 100,
        is_active: true,
        is_hot: product.hot || false,
        is_new: product.new || false,
        video_url: product.videoUrl || null
      })
      .select()
      .single();

    if (productError) throw productError;

    console.log(`  ✅ Product created with ID: ${productData.id}`);

    // 2. Insert features
    if (product.features && product.features.length > 0) {
      const features = product.features.map((feature, index) => ({
        product_id: productData.id,
        feature_text: feature,
        display_order: index
      }));

      const { error: featuresError } = await supabase
        .from('product_features')
        .insert(features);

      if (featuresError) throw featuresError;
      console.log(`  ✅ Added ${features.length} features`);
    }

    // 3. Insert sizes
    if (product.sizes && product.sizes.length > 0) {
      const sizes = product.sizes.map((size, index) => ({
        product_id: productData.id,
        size: size,
        stock: product.stock || 100,
        is_available: true,
        display_order: index
      }));

      const { error: sizesError } = await supabase
        .from('product_sizes')
        .insert(sizes);

      if (sizesError) throw sizesError;
      console.log(`  ✅ Added ${sizes.length} sizes`);
    }

    // 4. Upload images and create color records
    if (product.colors && product.colors.length > 0) {
      for (let i = 0; i < product.colors.length; i++) {
        const color = product.colors[i];

        // Create color record
        const { data: colorData, error: colorError } = await supabase
          .from('product_colors')
          .insert({
            product_id: productData.id,
            color_name: color,
            display_order: i
          })
          .select()
          .single();

        if (colorError) throw colorError;

        // Upload images for this color
        const colorImages = product.imagesByColor[color.toLowerCase()] || [];
        console.log(`  📸 Uploading ${colorImages.length} images for color: ${color}`);

        const uploadedUrls = [];
        for (const imagePath of colorImages) {
          const url = await uploadImageToSupabase(imagePath, product.name, color);
          if (url) {
            uploadedUrls.push(url);
          }
        }

        // Create image records
        if (uploadedUrls.length > 0) {
          const imageRecords = uploadedUrls.map((url, index) => ({
            product_id: productData.id,
            color_id: colorData.id,
            image_url: url,
            display_order: index,
            is_primary: i === 0 && index === 0 // First image of first color is primary
          }));

          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(imageRecords);

          if (imagesError) throw imagesError;
          console.log(`  ✅ Added ${uploadedUrls.length} images for ${color}`);
        }
      }
    }

    // Update main_image in product
    if (product.image) {
      const firstColor = product.colors[0].toLowerCase();
      const mainImageUrl = await uploadImageToSupabase(product.image, product.name, firstColor);

      if (mainImageUrl) {
        await supabase
          .from('products')
          .update({ main_image: mainImageUrl })
          .eq('id', productData.id);
      }
    }

    console.log(`  ✅ Migration complete for: ${product.name}\n`);
    return true;

  } catch (error) {
    console.error(`  ❌ Error migrating ${product.name}:`, error.message);
    return false;
  }
}

// Main migration function
async function migrate() {
  let successCount = 0;
  let failCount = 0;

  for (const product of staticProducts) {
    const success = await migrateProduct(product);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n=================================');
  console.log('📊 Migration Summary');
  console.log('=================================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📦 Total: ${staticProducts.length}`);
  console.log('=================================\n');

  if (successCount === staticProducts.length) {
    console.log('🎉 All products migrated successfully!');
    console.log('\nNext steps:');
    console.log('1. Set VITE_USE_SUPABASE=true in .env.local');
    console.log('2. Restart your dev server: npm run dev');
    console.log('3. Products will now be managed from the dashboard');
  } else {
    console.log('⚠️  Some products failed to migrate. Check the errors above.');
  }
}

// Run migration
migrate().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
