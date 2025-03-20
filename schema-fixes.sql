-- Fix missing columns in courses table
ALTER TABLE IF EXISTS courses 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Fix missing columns in workshops table
ALTER TABLE IF EXISTS workshops 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Fix missing column in discussions table
ALTER TABLE IF EXISTS discussions 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  title TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add relationship between mentors and profiles
ALTER TABLE IF EXISTS mentors
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

