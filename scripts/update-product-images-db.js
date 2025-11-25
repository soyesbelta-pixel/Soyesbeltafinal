import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://kynogljhbbvagneiydrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bm9nbGpoYmJ2YWduZWl5ZHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE3NzE5MywiZXhwIjoyMDc0NzUzMTkzfQ.s278KYIxYqW35fAeKB6ntT6EwKKJnZ7XWsBtSakIcdc';

const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCT_ID = '6968a2c2-3e80-4c68-854a-ecd6fadca227'; // Short Levanta Cola Magic Hombre

async function updateProductImages() {
  console.log('🚀 Starting database update for Short Magic Hombre...\n');

  try {
    // Read uploaded URLs
    const urlsPath = path.join(__dirname, 'uploaded-urls.json');
    const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'));

    // Step 1: Delete existing images for this product
    console.log('🗑️  Deleting existing images...');
    const { error: deleteImagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', PRODUCT_ID);

    if (deleteImagesError) throw deleteImagesError;
    console.log('✅ Existing images deleted\n');

    // Step 2: Delete existing colors
    console.log('🗑️  Deleting existing colors...');
    const { error: deleteColorsError } = await supabase
      .from('product_colors')
      .delete()
      .eq('product_id', PRODUCT_ID);

    if (deleteColorsError) throw deleteColorsError;
    console.log('✅ Existing colors deleted\n');

    // Step 3: Insert Negro color
    console.log('📦 Inserting Negro color...');
    const { data: negroColor, error: negroColorError } = await supabase
      .from('product_colors')
      .insert({
        product_id: PRODUCT_ID,
        color_name: 'Negro',
        display_order: 0
      })
      .select()
      .single();

    if (negroColorError) throw negroColorError;
    console.log(`✅ Negro color created (ID: ${negroColor.id})\n`);

    // Step 4: Insert Beige color
    console.log('📦 Inserting Beige color...');
    const { data: beigeColor, error: beigeColorError } = await supabase
      .from('product_colors')
      .insert({
        product_id: PRODUCT_ID,
        color_name: 'Beige',
        display_order: 1
      })
      .select()
      .single();

    if (beigeColorError) throw beigeColorError;
    console.log(`✅ Beige color created (ID: ${beigeColor.id})\n`);

    // Step 5: Insert Negro images
    console.log('🖼️  Inserting Negro images...');
    const negroImages = urls.negro.map((url, index) => ({
      product_id: PRODUCT_ID,
      color_id: negroColor.id,
      image_url: url,
      display_order: index,
      is_primary: index === 0
    }));

    const { error: negroImagesError } = await supabase
      .from('product_images')
      .insert(negroImages);

    if (negroImagesError) throw negroImagesError;
    console.log(`✅ ${negroImages.length} Negro images inserted\n`);

    // Step 6: Insert Beige images
    console.log('🖼️  Inserting Beige images...');
    const beigeImages = urls.beige.map((url, index) => ({
      product_id: PRODUCT_ID,
      color_id: beigeColor.id,
      image_url: url,
      display_order: index,
      is_primary: false
    }));

    const { error: beigeImagesError } = await supabase
      .from('product_images')
      .insert(beigeImages);

    if (beigeImagesError) throw beigeImagesError;
    console.log(`✅ ${beigeImages.length} Beige images inserted\n`);

    // Step 7: Update main_image
    console.log('🖼️  Updating main product image...');
    const { error: updateProductError } = await supabase
      .from('products')
      .update({ main_image: urls.negro[0] })
      .eq('id', PRODUCT_ID);

    if (updateProductError) throw updateProductError;
    console.log('✅ Main image updated\n');

    console.log('🎉 Database update complete!');
    console.log(`📊 Total images: ${negroImages.length + beigeImages.length}`);
    console.log(`   - Negro: ${negroImages.length} images`);
    console.log(`   - Beige: ${beigeImages.length} images`);

  } catch (error) {
    console.error('❌ Error updating database:', error);
    throw error;
  }
}

updateProductImages().catch(console.error);
