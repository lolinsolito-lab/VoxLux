-- Add icon column to bonus_products
ALTER TABLE bonus_products 
ADD COLUMN IF NOT EXISTS icon text DEFAULT '🎁';

-- Add icon column to upsell_products
ALTER TABLE upsell_products 
ADD COLUMN IF NOT EXISTS icon text DEFAULT '💎';
