-- Function to create discussions table if it doesn't exist
CREATE OR REPLACE FUNCTION create_discussions_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'discussions') THEN
    CREATE TABLE public.discussions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author_id UUID REFERENCES auth.users(id) NOT NULL,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      replies INTEGER DEFAULT 0,
      isPopular BOOLEAN DEFAULT FALSE,
      last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create discussion_contents table if it doesn't exist
CREATE OR REPLACE FUNCTION create_discussion_contents_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'discussion_contents') THEN
    CREATE TABLE public.discussion_contents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      discussion_id UUID REFERENCES public.discussions(id) NOT NULL,
      content TEXT NOT NULL,
      author_id UUID REFERENCES auth.users(id) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(discussion_id)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create discussion_comments table if it doesn't exist
CREATE OR REPLACE FUNCTION create_discussion_comments_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'discussion_comments') THEN
    CREATE TABLE public.discussion_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      discussion_id UUID REFERENCES public.discussions(id) NOT NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create discussion_likes table if it doesn't exist
CREATE OR REPLACE FUNCTION create_discussion_likes_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'discussion_likes') THEN
    CREATE TABLE public.discussion_likes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      discussion_id UUID REFERENCES public.discussions(id) NOT NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(discussion_id, user_id)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create comment_likes table if it doesn't exist
CREATE OR REPLACE FUNCTION create_comment_likes_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comment_likes') THEN
    CREATE TABLE public.comment_likes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      comment_id UUID REFERENCES public.discussion_comments(id) NOT NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(comment_id, user_id)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

