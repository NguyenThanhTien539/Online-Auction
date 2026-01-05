-- Migration: Add auction_end_email_sent column to products table
-- Purpose: Track if auction end notification email has been sent
-- Date: 2026-01-05

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS auction_end_email_sent BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_auction_end_email 
ON products(end_time, auction_end_email_sent) 
WHERE auction_end_email_sent = FALSE;

-- Comment
COMMENT ON COLUMN products.auction_end_email_sent IS 'Flag to track if auction end email notification has been sent';
