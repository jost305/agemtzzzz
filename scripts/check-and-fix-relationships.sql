-- Check existing tables and relationships
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('agents', 'categories', 'profiles')
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('agents', 'categories', 'profiles');

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    creator_id UUID REFERENCES profiles(id),
    pricing_model TEXT DEFAULT 'free',
    price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    features TEXT[],
    use_cases TEXT[],
    capabilities TEXT[],
    requirements TEXT,
    integrations TEXT[],
    api_access BOOLEAN DEFAULT FALSE,
    screenshots TEXT[],
    demo_video TEXT,
    documentation TEXT,
    instructions TEXT,
    tags TEXT[],
    target_audience TEXT[],
    supported_languages TEXT[] DEFAULT ARRAY['English'],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample categories if none exist
INSERT INTO categories (name, slug, description) 
SELECT * FROM (VALUES 
    ('Business Automation', 'business-automation', 'Automate business processes and workflows'),
    ('Data Processing', 'data-processing', 'Clean, analyze and process data'),
    ('Customer Service', 'customer-service', 'Enhance customer support and engagement'),
    ('Marketing', 'marketing', 'Marketing automation and campaign management'),
    ('Finance', 'finance', 'Financial analysis and accounting automation')
) AS v(name, slug, description)
WHERE NOT EXISTS (SELECT 1 FROM categories);
