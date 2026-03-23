-- Dalink tables (shared DB — all prefixed with dalink_)

-- Votes
CREATE TABLE dalink_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service_slug)
);
CREATE INDEX idx_dalink_votes_slug ON dalink_votes(service_slug);
ALTER TABLE dalink_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dalink_votes_select" ON dalink_votes FOR SELECT USING (true);
CREATE POLICY "dalink_votes_insert" ON dalink_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dalink_votes_delete" ON dalink_votes FOR DELETE USING (auth.uid() = user_id);

CREATE VIEW dalink_vote_counts WITH (security_invoker = true) AS
SELECT service_slug, COUNT(*) as count FROM dalink_votes GROUP BY service_slug;

-- Page Views
CREATE TABLE dalink_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_slug TEXT NOT NULL,
  viewer_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_dalink_views_slug ON dalink_page_views(service_slug);
CREATE INDEX idx_dalink_views_viewer_slug ON dalink_page_views(viewer_id, service_slug);
ALTER TABLE dalink_page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dalink_views_select" ON dalink_page_views FOR SELECT USING (true);
CREATE POLICY "dalink_views_insert_rate_limit" ON dalink_page_views FOR INSERT WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM dalink_page_views pv
    WHERE pv.viewer_id = dalink_page_views.viewer_id
      AND pv.service_slug = dalink_page_views.service_slug
      AND pv.viewed_at > NOW() - INTERVAL '24 hours'
  )
);

CREATE VIEW dalink_view_counts WITH (security_invoker = true) AS
SELECT service_slug, COUNT(DISTINCT viewer_id) as unique_views, COUNT(*) as total_views
FROM dalink_page_views GROUP BY service_slug;

-- Bookmarks
CREATE TABLE dalink_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service_slug)
);
CREATE INDEX idx_dalink_bookmarks_user ON dalink_bookmarks(user_id);
ALTER TABLE dalink_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dalink_bookmarks_select" ON dalink_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "dalink_bookmarks_insert" ON dalink_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dalink_bookmarks_delete" ON dalink_bookmarks FOR DELETE USING (auth.uid() = user_id);
