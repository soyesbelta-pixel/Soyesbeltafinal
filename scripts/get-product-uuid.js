import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kynogljhbbvagneiydrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bm9nbGpoYmJ2YWduZWl5ZHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE3NzE5MywiZXhwIjoyMDc0NzUzMTkzfQ.s278KYIxYqW35fAeKB6ntT6EwKKJnZ7XWsBtSakIcdc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getProduct() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', '%short%magic%hombre%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Products found:');
  console.log(JSON.stringify(data, null, 2));
}

getProduct();
