-- Migration: Update product categories
-- Date: 2025-01-08
-- Description: Update category constraint to use new category names

-- Step 1: Drop the old constraint FIRST
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Step 2: Update existing products to use new categories (BEFORE adding new constraint)
UPDATE products SET category = 'realce' WHERE category = 'diario';
UPDATE products SET category = 'moldeadoras' WHERE category = 'modeladora';
UPDATE products SET category = 'fajas' WHERE category = 'post-quirurgica';
UPDATE products SET category = 'realce' WHERE category = 'deportiva';
UPDATE products SET category = 'lenceria' WHERE category = 'maternidad';

-- Step 3: Now add new constraint with updated categories
ALTER TABLE products
ADD CONSTRAINT products_category_check
CHECK (category IN ('lenceria', 'realce', 'fajas', 'moldeadoras'));

-- Step 4: Verify the migration
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
ORDER BY category;
