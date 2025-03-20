-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration TEXT,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  instructor_name TEXT NOT NULL,
  instructor_title TEXT,
  instructor_avatar TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  what_you_will_learn JSONB,
  requirements JSONB,
  syllabus JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Enrollments Table
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Course Reviews Table
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Workshops Table
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  price DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  registered_count INTEGER DEFAULT 0,
  instructor_name TEXT NOT NULL,
  instructor_bio TEXT,
  instructor_avatar TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  agenda JSONB,
  prerequisites JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop Registrations Table
CREATE TABLE workshop_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workshop_id)
);

-- Create RLS policies for courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are viewable by everyone" 
ON courses FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own courses" 
ON courses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" 
ON courses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" 
ON courses FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for course_enrollments
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments" 
ON course_enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Course creators can view enrollments for their courses" 
ON course_enrollments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_enrollments.course_id 
    AND courses.user_id = auth.uid()
  )
);

CREATE POLICY "Users can enroll in courses" 
ON course_enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" 
ON course_enrollments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enrollments" 
ON course_enrollments FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for course_reviews
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" 
ON course_reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own reviews" 
ON course_reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON course_reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON course_reviews FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for workshops
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops are viewable by everyone" 
ON workshops FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own workshops" 
ON workshops FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workshops" 
ON workshops FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workshops" 
ON workshops FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for workshop_registrations
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" 
ON workshop_registrations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Workshop creators can view registrations for their workshops" 
ON workshop_registrations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM workshops 
    WHERE workshops.id = workshop_registrations.workshop_id 
    AND workshops.user_id = auth.uid()
  )
);

CREATE POLICY "Users can register for workshops" 
ON workshop_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registrations" 
ON workshop_registrations FOR DELETE 
USING (auth.uid() = user_id);

-- Create functions to update counts
CREATE OR REPLACE FUNCTION increment_course_students_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET students_count = students_count + 1
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_course_students_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET students_count = students_count - 1
  WHERE id = OLD.course_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_workshop_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workshops
  SET registered_count = registered_count + 1
  WHERE id = NEW.workshop_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_workshop_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workshops
  SET registered_count = registered_count - 1
  WHERE id = OLD.workshop_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER after_course_enrollment_insert
AFTER INSERT ON course_enrollments
FOR EACH ROW
EXECUTE FUNCTION increment_course_students_count();

CREATE TRIGGER after_course_enrollment_delete
AFTER DELETE ON course_enrollments
FOR EACH ROW
EXECUTE FUNCTION decrement_course_students_count();

CREATE TRIGGER after_workshop_registration_insert
AFTER INSERT ON workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION increment_workshop_registered_count();

CREATE TRIGGER after_workshop_registration_delete
AFTER DELETE ON workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION decrement_workshop_registered_count();

