-- 004_indexes.sql
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX idx_activity_user_id ON activity_records(user_id);
CREATE INDEX idx_activity_source ON activity_records(source_type, source_id);
CREATE INDEX idx_journal_entry_date ON journal_entries(entry_date);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_goals_title_trgm ON goals USING gin (title gin_trgm_ops);
CREATE INDEX idx_journal_content_trgm ON journal_entries USING gin (content gin_trgm_ops);
