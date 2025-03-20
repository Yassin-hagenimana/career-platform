-- Function to create courses table if it doesn't exist
CREATE OR REPLACE FUNCTION create_courses_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'courses') THEN
    CREATE TABLE public.courses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC DEFAULT 0,
      level TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      instructor_name TEXT NOT NULL,
      students_count INTEGER DEFAULT 0,
      rating NUMERIC,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create course_enrollments table if it doesn't exist
CREATE OR REPLACE FUNCTION create_course_enrollments_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'course_enrollments') THEN
    CREATE TABLE public.course_enrollments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      course_id UUID REFERENCES public.courses(id) NOT NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      payment_method TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(course_id, user_id)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create workshops table if it doesn't exist
CREATE OR REPLACE FUNCTION create_workshops_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workshops') THEN
    CREATE TABLE public.workshops (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      location TEXT,
      is_virtual BOOLEAN DEFAULT FALSE,
      price NUMERIC DEFAULT 0,
      capacity INTEGER DEFAULT 20,
      registered_count INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      image_url TEXT,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      instructor_name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create workshop_registrations table if it doesn't exist
CREATE OR REPLACE FUNCTION create_workshop_registrations_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workshop_registrations') THEN
    CREATE TABLE public.workshop_registrations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      workshop_id UUID REFERENCES public.workshops(id) NOT NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      organization TEXT,
      attendance_mode TEXT NOT NULL,
      dietary_requirements TEXT,
      special_requests TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(workshop_id, user_id)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

