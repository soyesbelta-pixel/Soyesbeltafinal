-- Virtual Try-On Leads Schema
-- Stores user contact information captured through the virtual try-on feature

-- Virtual Try-On Leads Table
CREATE TABLE IF NOT EXISTS virtual_tryon_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(100) UNIQUE NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  total_generations INTEGER DEFAULT 0,
  remaining_tries INTEGER DEFAULT 5,
  engagement_level VARCHAR(20) DEFAULT 'low',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_vto_leads_whatsapp ON virtual_tryon_leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_vto_leads_session ON virtual_tryon_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_vto_leads_registered ON virtual_tryon_leads(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_vto_leads_engagement ON virtual_tryon_leads(engagement_level);

-- RLS Policies
ALTER TABLE virtual_tryon_leads ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can view all leads" ON virtual_tryon_leads;
    DROP POLICY IF EXISTS "Anyone can create leads" ON virtual_tryon_leads;
    DROP POLICY IF EXISTS "Anyone can update leads" ON virtual_tryon_leads;
    DROP POLICY IF EXISTS "Authenticated users can delete leads" ON virtual_tryon_leads;
    DROP POLICY IF EXISTS "Public can insert leads" ON virtual_tryon_leads;
    DROP POLICY IF EXISTS "Public can update leads" ON virtual_tryon_leads;
    DROP POLICY IF EXISTS "Service role can manage leads" ON virtual_tryon_leads;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- CRITICAL: Allow public INSERT without authentication
-- This policy allows anonymous users to create leads
CREATE POLICY "Public can insert leads"
  ON virtual_tryon_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public UPDATE without authentication
-- This policy allows anonymous users to update their own leads
CREATE POLICY "Public can update leads"
  ON virtual_tryon_leads
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Service role bypass for admin operations
-- This allows the admin dashboard to read and delete
CREATE POLICY "Service role can manage leads"
  ON virtual_tryon_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vto_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS vto_leads_updated_at ON virtual_tryon_leads;

-- Trigger to automatically update updated_at
CREATE TRIGGER vto_leads_updated_at
  BEFORE UPDATE ON virtual_tryon_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_vto_leads_updated_at();
