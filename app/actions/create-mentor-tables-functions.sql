-- Create mentors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expertise TEXT[] DEFAULT '{}',
    experience_years INTEGER NOT NULL,
    bio TEXT,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    availability TEXT,
    profession TEXT,
    company TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    title TEXT,
    location TEXT,
    bio TEXT,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- Create mentorship_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goals TEXT NOT NULL,
    experience TEXT,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    response_message TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for mentors table
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Mentors are viewable by everyone" ON public.mentors;
    DROP POLICY IF EXISTS "Mentors can be created by authenticated users" ON public.mentors;
    DROP POLICY IF EXISTS "Mentors can be updated by the owner" ON public.mentors;
    DROP POLICY IF EXISTS "Mentors can be deleted by the owner" ON public.mentors;
    
    -- Create new policies
    CREATE POLICY "Mentors are viewable by everyone" 
    ON public.mentors FOR SELECT 
    USING (true);
    
    CREATE POLICY "Mentors can be created by authenticated users" 
    ON public.mentors FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Mentors can be updated by the owner" 
    ON public.mentors FOR UPDATE 
    USING (auth.uid() = user_id);
    
    CREATE POLICY "Mentors can be deleted by the owner" 
    ON public.mentors FOR DELETE 
    USING (auth.uid() = user_id);
END
$$;

-- Create RLS policies for profiles table
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Profiles can be created by authenticated users" ON public.profiles;
    DROP POLICY IF EXISTS "Profiles can be updated by the owner" ON public.profiles;
    DROP POLICY IF EXISTS "Profiles can be deleted by the owner" ON public.profiles;
    
    -- Create new policies
    CREATE POLICY "Profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);
    
    CREATE POLICY "Profiles can be created by authenticated users" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Profiles can be updated by the owner" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);
    
    CREATE POLICY "Profiles can be deleted by the owner" 
    ON public.profiles FOR DELETE 
    USING (auth.uid() = user_id);
END
$$;

-- Create RLS policies for mentorship_requests table
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Mentorship requests are viewable by the mentor and mentee" ON public.mentorship_requests;
    DROP POLICY IF EXISTS "Mentorship requests can be created by authenticated users" ON public.mentorship_requests;
    DROP POLICY IF EXISTS "Mentorship requests can be updated by the mentor" ON public.mentorship_requests;
    DROP POLICY IF EXISTS "Mentorship requests can be deleted by the mentee" ON public.mentorship_requests;
    
    -- Create new policies
    CREATE POLICY "Mentorship requests are viewable by the mentor and mentee" 
    ON public.mentorship_requests FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.mentors 
            WHERE mentors.id = mentorship_requests.mentor_id 
            AND mentors.user_id = auth.uid()
        ) OR auth.uid() = mentee_id
    );
    
    CREATE POLICY "Mentorship requests can be created by authenticated users" 
    ON public.mentorship_requests FOR INSERT 
    WITH CHECK (auth.uid() = mentee_id);
    
    CREATE POLICY "Mentorship requests can be updated by the mentor" 
    ON public.mentorship_requests FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.mentors 
            WHERE mentors.id = mentorship_requests.mentor_id 
            AND mentors.user_id = auth.uid()
        )
    );
    
    CREATE POLICY "Mentorship requests can be deleted by the mentee" 
    ON public.mentorship_requests FOR DELETE 
    USING (auth.uid() = mentee_id);
END
$$;

-- Enable RLS on all tables
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Create function to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create a profile when a user signs up
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- Create function to update a profile when a user updates their metadata
CREATE OR REPLACE FUNCTION public.update_profile_on_metadata_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        full_name = NEW.raw_user_meta_data->>'full_name',
        updated_at = now()
    WHERE user_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update a profile when a user updates their metadata
DROP TRIGGER IF EXISTS update_profile_trigger ON auth.users;
CREATE TRIGGER update_profile_trigger
AFTER UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW
WHEN (OLD.raw_user_meta_data->>'full_name' IS DISTINCT FROM NEW.raw_user_meta_data->>'full_name')
EXECUTE FUNCTION public.update_profile_on_metadata_update();

