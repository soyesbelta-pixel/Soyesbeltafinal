import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials - using SERVICE_ROLE_KEY for upload permissions
const supabaseUrl = 'https://kynogljhbbvagneiydrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bm9nbGpoYmJ2YWduZWl5ZHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE3NzE5MywiZXhwIjoyMDc0NzUzMTkzfQ.s278KYIxYqW35fAeKB6ntT6EwKKJnZ7XWsBtSakIcdc';

const supabase = createClient(supabaseUrl, supabaseKey);

const images = {
  negro: [
    'short-magic-negro-1.png',
    'short-magic-negro-2.png',
    'short-magic-negro-3.png'
  ],
  beige: [
    'short-magic-beige-1.png',
    'short-magic-beige-2.png',
    'short-magic-beige-3.png',
    'short-magic-beige-4.png',
    'short-magic-beige-5.png',
    'short-magic-beige-6.png'
  ]
};

async function optimizeAndUpload(filePath, uploadPath) {
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    console.log(`📤 Uploading: ${path.basename(filePath)} → ${uploadPath}`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uploadPath, fileBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });

    if (error) {
      console.error(`❌ Error uploading ${filePath}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadPath);

    console.log(`✅ Uploaded: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting upload of Short Magic Hombre images...\n');

  const publicDir = path.join(__dirname, '..', 'public');
  const productPath = 'products/short-levanta-cola-magic-hombre';

  const uploadedUrls = {
    negro: [],
    beige: []
  };

  // Upload negro images
  console.log('📦 Uploading NEGRO color images...');
  for (const imageName of images.negro) {
    const localPath = path.join(publicDir, imageName);
    const uploadPath = `${productPath}/negro/${imageName}`;
    const url = await optimizeAndUpload(localPath, uploadPath);
    if (url) uploadedUrls.negro.push(url);
  }

  console.log('');

  // Upload beige images
  console.log('📦 Uploading BEIGE color images...');
  for (const imageName of images.beige) {
    const localPath = path.join(publicDir, imageName);
    const uploadPath = `${productPath}/beige/${imageName}`;
    const url = await optimizeAndUpload(localPath, uploadPath);
    if (url) uploadedUrls.beige.push(url);
  }

  console.log('\n✅ Upload complete!\n');
  console.log('📋 Uploaded URLs:');
  console.log('Negro:', uploadedUrls.negro.length, 'images');
  console.log('Beige:', uploadedUrls.beige.length, 'images');

  // Save URLs to file for reference
  const outputPath = path.join(__dirname, 'uploaded-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\n💾 URLs saved to: ${outputPath}`);
}

uploadAllImages().catch(console.error);
