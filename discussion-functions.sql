-- Function to increment discussion views
CREATE OR REPLACE FUNCTION increment_discussion_views(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE discussions
  SET views = views + 1
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment discussion replies
CREATE OR REPLACE FUNCTION increment_discussion_replies(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE discussions
  SET 
    replies = replies + 1,
    last_activity = NOW()
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment discussion likes
CREATE OR REPLACE FUNCTION increment_discussion_likes(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE discussions
  SET likes = likes + 1
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement discussion likes
CREATE OR REPLACE FUNCTION decrement_discussion_likes(discussion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE discussions
  SET likes = GREATEST(0, likes - 1)
  WHERE id = discussion_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_activity when a new comment is added
CREATE OR REPLACE FUNCTION update_discussion_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE discussions
  SET last_activity = NOW()
  WHERE id = NEW.discussion_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discussion_comment_added
AFTER INSERT ON discussion_comments
FOR EACH ROW
EXECUTE FUNCTION update_discussion_last_activity();

