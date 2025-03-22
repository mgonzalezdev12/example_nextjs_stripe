-- Add code and language fields to components table
ALTER TABLE components ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE components ADD COLUMN IF NOT EXISTS language_type TEXT;
ALTER TABLE components ADD COLUMN IF NOT EXISTS installation_guide TEXT;
ALTER TABLE components ADD COLUMN IF NOT EXISTS documentation TEXT;
ALTER TABLE components ADD COLUMN IF NOT EXISTS preview_image_url TEXT;
ALTER TABLE components ADD COLUMN IF NOT EXISTS git_repo_url TEXT;

-- Update the components table to include preview image and git repo url
CREATE INDEX IF NOT EXISTS idx_components_language_type ON components(language_type);

-- Enable RLS on components table
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Create policy for components table
DROP POLICY IF EXISTS "Public users can view free components" ON components;
CREATE POLICY "Public users can view free components"
ON components FOR SELECT
USING (is_premium = false OR (is_premium = true AND EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.subscription_tier IS NOT NULL AND profiles.subscription_expires_at > NOW()
)));

-- Create policy for private components
DROP POLICY IF EXISTS "Only admins can insert components" ON components;
CREATE POLICY "Only admins can insert components"
ON components FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
));

-- Enable realtime for components
alter publication supabase_realtime add table components;
