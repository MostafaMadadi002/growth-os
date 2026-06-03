-- 005_rls_policies.sql

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can manage their own profile" ON profiles 
    FOR ALL USING (auth.uid() = id);

-- Goals: Users can only see and edit their own active goals
CREATE POLICY "Users can manage their own active goals" ON goals 
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Milestones
CREATE POLICY "Users can manage milestones for their goals" ON milestones 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM goals 
            WHERE goals.id = milestones.goal_id 
            AND goals.user_id = auth.uid()
        ) AND deleted_at IS NULL
    );

-- Progress Records
CREATE POLICY "Users can manage progress for their milestones" ON progress_records 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM milestones
            JOIN goals ON goals.id = milestones.goal_id
            WHERE milestones.id = progress_records.milestone_id 
            AND goals.user_id = auth.uid()
        ) AND deleted_at IS NULL
    );

-- Habits
CREATE POLICY "Users can manage their own active habits" ON habits 
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Habit Logs
CREATE POLICY "Users can manage logs for their habits" ON habit_logs 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM habits 
            WHERE habits.id = habit_logs.habit_id 
            AND habits.user_id = auth.uid()
        )
    );

-- Journal Entries
CREATE POLICY "Users can manage their own active journal" ON journal_entries 
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Activity Records
CREATE POLICY "Users can manage their own activity" ON activity_records 
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- User Achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements 
    FOR SELECT USING (auth.uid() = user_id);
