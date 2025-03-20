-- Create function to create funding tables if they don't exist
CREATE OR REPLACE FUNCTION create_funding_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the funding_opportunities table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'funding_opportunities') THEN
    -- Create the funding_opportunities table
    CREATE TABLE funding_opportunities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      full_description TEXT,
      amount DECIMAL(10, 2) NOT NULL,
      deadline DATE NOT NULL,
      organization TEXT NOT NULL,
      eligibility JSONB NOT NULL,
      category TEXT NOT NULL,
      application_link TEXT NOT NULL,
      logo_url TEXT,
      requirements JSONB,
      benefits JSONB,
      application_process JSONB,
      contact_email TEXT,
      website TEXT,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Insert sample data
    INSERT INTO funding_opportunities (
      title, 
      description, 
      amount, 
      deadline, 
      organization, 
      eligibility, 
      category, 
      application_link,
      full_description,
      requirements,
      benefits,
      application_process,
      contact_email,
      website
    ) VALUES 
    (
      'Tech Startup Grant', 
      'Funding for innovative tech startups with a focus on sustainability.', 
      25000, 
      (CURRENT_DATE + INTERVAL '60 days')::DATE, 
      'Future Tech Foundation', 
      '["Early-stage startups", "Tech sector", "Less than 2 years old"]', 
      'Grant', 
      'https://example.com/apply',
      'This grant program aims to support early-stage technology startups that are developing innovative solutions with a focus on sustainability and environmental impact. The funding can be used for product development, market research, hiring key personnel, or other business development activities.',
      '["Business plan", "Proof of concept", "Team bios", "Financial projections"]',
      '["Non-dilutive funding", "Mentorship opportunities", "Networking events", "Industry connections"]',
      '["Submit initial application", "Selected applicants invited for interview", "Final pitch to selection committee", "Funding decision within 4 weeks"]',
      'grants@futuretechfoundation.org',
      'https://futuretechfoundation.org/grants'
    ),
    (
      'Women in STEM Scholarship', 
      'Supporting women pursuing careers in Science, Technology, Engineering, and Mathematics.', 
      10000, 
      (CURRENT_DATE + INTERVAL '45 days')::DATE, 
      'Women in Tech Alliance', 
      '["Women", "STEM fields", "Undergraduate or graduate students"]', 
      'Scholarship', 
      'https://example.com/apply',
      'The Women in STEM Scholarship program is designed to support and encourage women pursuing education and careers in Science, Technology, Engineering, and Mathematics fields. This scholarship aims to address the gender gap in STEM disciplines by providing financial assistance to promising female students.',
      '["Academic transcripts", "Personal statement", "Letter of recommendation", "Proof of enrollment"]',
      '["Financial support", "Mentorship program", "Professional development workshops", "Industry networking events"]',
      '["Complete online application", "Submit required documents", "Shortlisted candidates interviewed", "Recipients announced within 6 weeks"]',
      'scholarships@womenintech.org',
      'https://womenintech.org/scholarships'
    ),
    (
      'Social Impact Accelerator', 
      'Funding and mentorship for startups addressing social challenges.', 
      50000, 
      (CURRENT_DATE + INTERVAL '90 days')::DATE, 
      'Change Makers Fund', 
      '["Social enterprises", "Proven impact", "Scalable solution"]', 
      'Accelerator', 
      'https://example.com/apply',
      'The Social Impact Accelerator program provides funding, mentorship, and resources to startups and social enterprises that are addressing critical social and environmental challenges. We focus on ventures with innovative, scalable solutions that have the potential to create significant positive impact.',
      '["Business plan", "Impact metrics", "Team composition", "Market analysis"]',
      '["Seed funding", "Intensive 12-week program", "Expert mentorship", "Demo day with investors"]',
      '["Submit application", "Initial screening", "In-person pitch", "Final selection"]',
      'accelerator@changemakersfund.org',
      'https://changemakersfund.org/accelerator'
    );

    -- Create RLS policies
    ALTER TABLE funding_opportunities ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Funding opportunities are viewable by everyone" 
    ON funding_opportunities FOR SELECT 
    USING (true);

    CREATE POLICY "Users can insert their own funding opportunities" 
    ON funding_opportunities FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own funding opportunities" 
    ON funding_opportunities FOR UPDATE 
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own funding opportunities" 
    ON funding_opportunities FOR DELETE 
    USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to create funding applications table if it doesn't exist
CREATE OR REPLACE FUNCTION create_funding_applications_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the funding_applications table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'funding_applications') THEN
    -- Create the funding_applications table
    CREATE TABLE funding_applications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT NOT NULL,
      funding_type TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      purpose TEXT NOT NULL,
      timeline TEXT NOT NULL,
      background TEXT NOT NULL,
      impact TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create RLS policies
    ALTER TABLE funding_applications ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own applications" 
    ON funding_applications FOR SELECT 
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own applications" 
    ON funding_applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

    CREATE POLICY "Users can update their own applications" 
    ON funding_applications FOR UPDATE 
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own applications" 
    ON funding_applications FOR DELETE 
    USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

