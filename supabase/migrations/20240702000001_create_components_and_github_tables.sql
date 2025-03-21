-- Create components table to store component code and designs
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  framework VARCHAR(50) NOT NULL,
  react_code TEXT,
  swift_code TEXT,
  preview_image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  github_repo_id UUID
);

-- Create github_repositories table to store repository information
CREATE TABLE IF NOT EXISTS github_repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_name VARCHAR(255) NOT NULL,
  repo_owner VARCHAR(255) NOT NULL,
  repo_url TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  github_repo_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create github_collaborators table to store repository access permissions
CREATE TABLE IF NOT EXISTS github_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES github_repositories(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  permission_level VARCHAR(50) DEFAULT 'read',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(repository_id, email)
);

-- Add foreign key to components table
ALTER TABLE components ADD CONSTRAINT fk_github_repo
  FOREIGN KEY (github_repo_id) REFERENCES github_repositories(id) ON DELETE SET NULL;

-- Enable realtime for all tables
alter publication supabase_realtime add table components;
alter publication supabase_realtime add table github_repositories;
alter publication supabase_realtime add table github_collaborators;
