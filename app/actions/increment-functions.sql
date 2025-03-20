-- Function to increment workshop registrations
CREATE OR REPLACE FUNCTION increment_workshop_registrations(workshop_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE workshops
  SET registered_count = registered_count + 1
  WHERE id = workshop_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment course enrollments
CREATE OR REPLACE FUNCTION increment_course_enrollments(course_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE courses
  SET students_count = students_count + 1
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create funding applications table if it doesn't exist
CREATE OR REPLACE FUNCTION create_funding_applications_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'funding_applications') THEN
    CREATE TABLE public.funding_applications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT NOT NULL,
      funding_type TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      purpose TEXT NOT NULL,
      timeline TEXT NOT NULL,
      background TEXT NOT NULL,
      impact TEXT NOT NULL,
      user_id UUID REFERENCES auth.users(id),
      status TEXT NOT NULL DEFAULT 'Pending',
      feedback TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

