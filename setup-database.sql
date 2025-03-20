-- Create tables based on our schema

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  country TEXT,
  user_type TEXT CHECK (user_type IN ('jobseeker', 'entrepreneur', 'mentor'))
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo TEXT,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  enrolled INTEGER DEFAULT 0,
  isFeatured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id)
);

-- Funding opportunities table
CREATE TABLE IF NOT EXISTS public.funding_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  amount TEXT NOT NULL,
  deadline TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  provider TEXT NOT NULL,
  applicants INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id)
);

-- Workshops table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  host TEXT NOT NULL,
  hostTitle TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  recording BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id)
);

-- Discussions table
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) NOT NULL,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  isPopular BOOLEAN DEFAULT FALSE
);

-- Insert sample data for jobs
INSERT INTO public.jobs (title, company, logo, location, type, category, salary, description, featured)
VALUES
  ('Frontend Developer', 'TechCorp', NULL, 'Nairobi, Kenya', 'Full-time', 'Technology', '$60,000 - $80,000', 'We are looking for a skilled Frontend Developer to join our team...', TRUE),
  ('Marketing Manager', 'GrowthCo', NULL, 'Lagos, Nigeria', 'Full-time', 'Marketing', '$50,000 - $70,000', 'Lead our marketing efforts across Africa...', FALSE),
  ('Financial Analyst', 'AfriFinance', NULL, 'Cape Town, South Africa', 'Contract', 'Finance', '$40,000 - $60,000', 'Analyze financial data and prepare reports...', FALSE),
  ('UX Designer', 'DesignHub', NULL, 'Remote', 'Part-time', 'Design', '$30 - $50 per hour', 'Create user-centered designs for our products...', TRUE),
  ('Project Manager', 'BuildAfrica', NULL, 'Accra, Ghana', 'Full-time', 'Management', '$70,000 - $90,000', 'Oversee construction projects across West Africa...', FALSE);

