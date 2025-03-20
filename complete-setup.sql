-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  country TEXT,
  user_type TEXT CHECK (user_type IN ('jobseeker', 'entrepreneur', 'mentor', 'employer', 'admin')),
  bio TEXT,
  skills TEXT[],
  experience_years INTEGER,
  education TEXT,
  social_links JSONB
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
  requirements TEXT,
  responsibilities TEXT,
  application_deadline DATE,
  featured BOOLEAN DEFAULT FALSE,
  remote BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT NOT NULL,
  experience TEXT NOT NULL,
  current_role TEXT NOT NULL,
  current_company TEXT,
  linkedin_profile TEXT,
  portfolio_website TEXT,
  cover_letter TEXT NOT NULL,
  salary_expectation TEXT,
  notice_period TEXT,
  start_date TEXT,
  relocate TEXT NOT NULL,
  work_authorization BOOLEAN DEFAULT FALSE,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected')),
  UNIQUE(job_id, user_id)
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
  price DECIMAL(10, 2),
  start_date DATE,
  instructor TEXT NOT NULL,
  syllabus JSONB,
  enrolled INTEGER DEFAULT 0,
  isFeatured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  amount_paid DECIMAL(10, 2) NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  certificate_issued BOOLEAN DEFAULT FALSE,
  UNIQUE(course_id, user_id)
);

-- Funding opportunities table
CREATE TABLE IF NOT EXISTS public.funding_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  provider TEXT NOT NULL,
  application_process TEXT,
  applicants INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Funding applications table
CREATE TABLE IF NOT EXISTS public.funding_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  funding_id UUID REFERENCES public.funding_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  registration_number TEXT,
  founding_date DATE,
  website TEXT,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_category TEXT NOT NULL,
  funding_amount TEXT NOT NULL,
  project_duration TEXT NOT NULL,
  has_previous_funding TEXT NOT NULL,
  previous_funding_details TEXT,
  budget TEXT NOT NULL,
  impact TEXT NOT NULL,
  sustainability TEXT NOT NULL,
  documents_url TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  UNIQUE(funding_id, user_id)
);

-- Workshops table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT,
  location_type TEXT NOT NULL CHECK (location_type IN ('virtual', 'in-person', 'hybrid')),
  location_details TEXT,
  host TEXT NOT NULL,
  hostTitle TEXT NOT NULL,
  capacity INTEGER,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  attendees INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  recording BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Workshop registrations table
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT,
  attendance_mode TEXT NOT NULL CHECK (attendance_mode IN ('in-person', 'virtual')),
  dietary_requirements TEXT,
  special_requests TEXT,
  payment_status TEXT DEFAULT 'not_applicable' CHECK (payment_status IN ('not_applicable', 'pending', 'completed', 'failed')),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(workshop_id, user_id)
);

-- Discussions table
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  isPopular BOOLEAN DEFAULT FALSE
);

-- Discussion contents table
CREATE TABLE IF NOT EXISTS public.discussion_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE
);

-- Mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  profession TEXT NOT NULL,
  company TEXT NOT NULL,
  experience_years TEXT NOT NULL,
  expertise TEXT[] NOT NULL,
  motivation TEXT NOT NULL,
  availability TEXT NOT NULL,
  linkedin TEXT,
  rating DECIMAL(3, 2),
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id)
);

-- Mentor expertise categories
CREATE TABLE IF NOT EXISTS public.mentor_expertise (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

-- Mentorship requests table
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  goals TEXT NOT NULL,
  experience TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  UNIQUE(mentor_id, mentee_id)
);

-- Mentorship sessions table
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mentorship_id UUID REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled'))
);

-- Mentor reviews table
CREATE TABLE IF NOT EXISTS public.mentor_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  UNIQUE(mentor_id, user_id)
);

-- Insert sample mentor expertise categories
INSERT INTO public.mentor_expertise (name)
VALUES
  ('Software Development'),
  ('Career Transitions'),
  ('Technical Interviews'),
  ('Entrepreneurship'),
  ('Business Strategy'),
  ('Fundraising'),
  ('Digital Marketing'),
  ('Brand Strategy'),
  ('Content Creation'),
  ('Financial Planning'),
  ('Investment Strategy'),
  ('FinTech'),
  ('Resume Building'),
  ('Interview Preparation'),
  ('Career Planning'),
  ('Product Management'),
  ('UX Design'),
  ('Tech Career Advice')
ON CONFLICT (name) DO NOTHING;

