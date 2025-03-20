-- Function to create the funding_application_documents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_funding_application_documents_table_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Check if the table exists
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'funding_application_documents'
    ) THEN
        -- Create the table
        CREATE TABLE public.funding_application_documents (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            application_id UUID NOT NULL REFERENCES public.funding_applications(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            file_type TEXT,
            file_size INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Add RLS policies
        ALTER TABLE public.funding_application_documents ENABLE ROW LEVEL SECURITY;

        -- Policy for selecting documents (only the owner of the application can see them)
        CREATE POLICY "Users can view their own application documents"
        ON public.funding_application_documents
        FOR SELECT
        USING (
            application_id IN (
                SELECT id FROM public.funding_applications
                WHERE user_id = auth.uid()
            )
        );

        -- Policy for inserting documents (only authenticated users)
        CREATE POLICY "Users can insert their own application documents"
        ON public.funding_application_documents
        FOR INSERT
        WITH CHECK (
            application_id IN (
                SELECT id FROM public.funding_applications
                WHERE user_id = auth.uid()
            )
        );

        -- Policy for updating documents (only the owner can update)
        CREATE POLICY "Users can update their own application documents"
        ON public.funding_application_documents
        FOR UPDATE
        USING (
            application_id IN (
                SELECT id FROM public.funding_applications
                WHERE user_id = auth.uid()
            )
        );

        -- Policy for deleting documents (only the owner can delete)
        CREATE POLICY "Users can delete their own application documents"
        ON public.funding_application_documents
        FOR DELETE
        USING (
            application_id IN (
                SELECT id FROM public.funding_applications
                WHERE user_id = auth.uid()
            )
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

