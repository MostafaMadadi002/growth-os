-- 003_junction_tables.sql

-- User Achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal Habits
CREATE TABLE goal_habits (
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, habit_id)
);

-- Goal Journals
CREATE TABLE goal_journals (
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    journal_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, journal_id)
);
