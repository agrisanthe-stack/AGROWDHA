-- Migration: Add org_qr_code_url column to users table
-- Applied manually before schema was tracked via drizzle-kit
ALTER TABLE users ADD COLUMN IF NOT EXISTS org_qr_code_url text;
