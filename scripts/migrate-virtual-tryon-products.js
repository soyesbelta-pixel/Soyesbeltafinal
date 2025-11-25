import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

// Use SERVICE_ROLE_KEY for admin operations (bypasses RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const EXISTING_PRODUCTS = [
  {
    name: 'Professional Shaping Waist Trainer',
    display_name: 'Cintura Reloj de Arena',
    display_image_url: '/virtual-tryon/products/product2-display.png',
    reference_image_url: '/virtual-tryon/products/product2.png',
    ai_prompt: 'faja modeladora profesional de cintura, prenda de compresión que define la silueta de forma natural, exactamente como aparece en la imagen de referencia',
    is_active: true,
    display_order: 1
  },
  {
    name: 'Professional Sports Leggings',
    display_name: 'Cachetero Levanta Cola',
    display_image_url: '/virtual-tryon/products/product5-display.png',
    reference_image_url: '/virtual-tryon/products/product5.png',
    ai_prompt: 'leggins deportivos profesionales como se muestran exactamente en la imagen de referencia, prenda de compresión técnica opaca, material de alto rendimiento',
    is_active: true,
    display_order: 2
  },
  {
    name: 'Performance Gym Shorts',
    display_name: 'Short Levanta Gluteo Invisible',
    display_image_url: '/virtual-tryon/products/product7-display.png',
    reference_image_url: '/virtual-tryon/products/product7.png',
    ai_prompt: 'short deportivo de rendimiento profesional como se muestra exactamente en la imagen de referencia, prenda técnica opaca para gimnasio',
    is_active: true,
    display_order: 3
  },
  {
    name: 'Professional Compression Shorts',
    display_name: 'Short Levanta Cola',
    display_image_url: '/virtual-tryon/products/product8-display.png',
    reference_image_url: '/virtual-tryon/products/product8.png',
    ai_prompt: 'short de compresión deportivo profesional de color negro como se muestra exactamente en la imagen de referencia, prenda técnica de alto rendimiento con tecnología de modelado y soporte, longitud media hasta medio muslo, diseño anatómico deportivo',
    is_active: true,
    display_order: 4
  }
];

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos del probador virtual...\n');

  try {
    // Verificar conexión
    const { data: testData, error: testError } = await supabase
      .from('virtual_tryon_products')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión a Supabase:', testError.message);
      console.log('\n💡 Verifica que:');
      console.log('   1. Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en .env');
      console.log('   2. El schema SQL se haya ejecutado correctamente en Supabase');
      process.exit(1);
    }

    console.log('✅ Conexión a Supabase exitosa\n');

    // Insertar productos (UUID se genera automáticamente)
    for (const product of EXISTING_PRODUCTS) {
      console.log(`📦 Insertando: ${product.display_name}...`);

      const { data, error } = await supabase
        .from('virtual_tryon_products')
        .insert(product)
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Insertado correctamente (ID: ${data.id})`);
      }
    }

    console.log('\n🎉 Migración completada exitosamente!');
    console.log(`📊 Total de productos: ${EXISTING_PRODUCTS.length}`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

migrateProducts();
