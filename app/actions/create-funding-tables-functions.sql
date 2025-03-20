-- Function to create funding_opportunities table if it doesn't exist
CREATE OR REPLACE FUNCTION create_funding_opportunities_table_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Check if the table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'funding_opportunities') THEN
        -- Create the table
        CREATE TABLE public.funding_opportunities (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT,
            amount TEXT NOT NULL,
            deadline TIMESTAMP WITH TIME ZONE NOT NULL,
            category TEXT NOT NULL,
            eligibility TEXT NOT NULL,
            provider TEXT NOT NULL,
            application_process TEXT,
            applicants INTEGER DEFAULT 0,
            featured BOOLEAN DEFAULT FALSE,
            user_id UUID REFERENCES auth.users(id)
        );

        -- Set up RLS policies
        ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;

        -- Policy for selecting funding opportunities (public read)
        CREATE POLICY "Anyone can view funding opportunities" 
        ON public.funding_opportunities FOR SELECT 
        USING (true);

        -- Policy for inserting funding opportunities (authenticated users only)
        CREATE POLICY "Authenticated users can create funding opportunities" 
        ON public.funding_opportunities FOR INSERT 
        TO authenticated 
        WITH CHECK (true);

        -- Policy for updating funding opportunities (only the creator or admin)
        CREATE POLICY "Users can update their own funding opportunities" 
        ON public.funding_opportunities FOR UPDATE 
        TO authenticated 
        USING (auth.uid() = user_id);

        -- Policy for deleting funding opportunities (only the creator or admin)
        CREATE POLICY "Users can delete their own funding opportunities" 
        ON public.funding_opportunities FOR DELETE 
        TO authenticated 
        USING (auth.uid() = user_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

