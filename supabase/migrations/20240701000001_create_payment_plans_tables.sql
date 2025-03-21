-- Create plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  stripe_id TEXT,
  stripe_price_id TEXT,
  currency TEXT,
  interval TEXT,
  current_period_start BIGINT,
  current_period_end BIGINT,
  cancel_at_period_end BOOLEAN DEFAULT false,
  amount BIGINT,
  started_at BIGINT,
  customer_id TEXT,
  metadata JSONB,
  canceled_at BIGINT,
  ended_at BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create access_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  can_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(plan_id, resource_type)
);

-- Insert plan data
INSERT INTO plans (name, price, description, features)
VALUES 
  ('Code Plan', 49.99, 'Access to design code and components', 
   '["Copy design code", "Access to design components"]'::jsonb),
  ('Web Plan', 99.99, 'Access to web components and repositories', 
   '["Copy design code", "Access to design components", "Web components", "Web repositories (JS, PHP)"]'::jsonb),
  ('Premium Plan', 199.99, 'Access to all components and repositories', 
   '["Copy design code", "Access to design components", "Web components", "Web repositories (JS, PHP)", "All repositories for all languages"]'::jsonb);

-- Insert access permissions for Code Plan
INSERT INTO access_permissions (plan_id, resource_type, can_access)
VALUES 
  ((SELECT id FROM plans WHERE name = 'Code Plan'), 'design_code', true),
  ((SELECT id FROM plans WHERE name = 'Code Plan'), 'design_components', true),
  ((SELECT id FROM plans WHERE name = 'Code Plan'), 'web_components', false),
  ((SELECT id FROM plans WHERE name = 'Code Plan'), 'web_repositories', false),
  ((SELECT id FROM plans WHERE name = 'Code Plan'), 'all_repositories', false);

-- Insert access permissions for Web Plan
INSERT INTO access_permissions (plan_id, resource_type, can_access)
VALUES 
  ((SELECT id FROM plans WHERE name = 'Web Plan'), 'design_code', true),
  ((SELECT id FROM plans WHERE name = 'Web Plan'), 'design_components', true),
  ((SELECT id FROM plans WHERE name = 'Web Plan'), 'web_components', true),
  ((SELECT id FROM plans WHERE name = 'Web Plan'), 'web_repositories', true),
  ((SELECT id FROM plans WHERE name = 'Web Plan'), 'all_repositories', false);

-- Insert access permissions for Premium Plan
INSERT INTO access_permissions (plan_id, resource_type, can_access)
VALUES 
  ((SELECT id FROM plans WHERE name = 'Premium Plan'), 'design_code', true),
  ((SELECT id FROM plans WHERE name = 'Premium Plan'), 'design_components', true),
  ((SELECT id FROM plans WHERE name = 'Premium Plan'), 'web_components', true),
  ((SELECT id FROM plans WHERE name = 'Premium Plan'), 'web_repositories', true),
  ((SELECT id FROM plans WHERE name = 'Premium Plan'), 'all_repositories', true);

-- Create webhook_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  type TEXT NOT NULL,
  stripe_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
  data JSONB
);

-- Enable realtime for these tables
alter publication supabase_realtime add table plans;
alter publication supabase_realtime add table subscriptions;
alter publication supabase_realtime add table access_permissions;
alter publication supabase_realtime add table webhook_events;