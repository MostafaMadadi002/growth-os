# GrowthOS Database Design (Phase 2)

## 1. Physical Schema (PostgreSQL)

```sql
-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE visibility_type AS ENUM ('private', 'shared', 'public');
CREATE TYPE goal_category AS ENUM ('EDUCATION', 'PERSONAL', 'FITNESS', 'TRADING', 'CAREER', 'FINANCE');
CREATE TYPE goal_level AS ENUM ('S', 'A', 'B', 'C');
CREATE TYPE goal_status AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD', 'OVERDUE');
CREATE TYPE habit_type AS ENUM ('BINARY', 'QUANTITATIVE');
CREATE TYPE habit_status AS ENUM ('DONE', 'PARTIAL', 'MISSED');
CREATE TYPE frequency_type AS ENUM ('DAILY', 'WEEKLY');
CREATE TYPE achievement_type AS ENUM ('SYSTEM', 'USER');
CREATE TYPE activity_event_type AS ENUM (
    'JOURNAL_CREATED', 
    'HABIT_COMPLETED', 
    'GOAL_COMPLETED', 
    'MILESTONE_COMPLETED', 
    'WORKOUT_LOGGED', 
    'TRADE_REVIEWED', 
    'CUSTOM'
);

-- 2. CORE TABLES

-- User Profiles (Extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    growth_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

-- Point Configuration Rules
CREATE TABLE point_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type activity_event_type UNIQUE NOT NULL,
    points_value INTEGER NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category goal_category NOT NULL,
    level goal_level NOT NULL,
    status goal_status DEFAULT 'ACTIVE',
    visibility visibility_type DEFAULT 'private',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Progress Records
CREATE TABLE progress_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    notes TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Habits
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type habit_type DEFAULT 'BINARY',
    is_good BOOLEAN DEFAULT TRUE,
    frequency frequency_type DEFAULT 'DAILY',
    visibility visibility_type DEFAULT 'private',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Habit Logs
CREATE TABLE habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    status habit_status NOT NULL,
    value NUMERIC,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    visibility visibility_type DEFAULT 'private',
    entry_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Activity Records (The Unified Engine)
CREATE TABLE activity_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_type activity_event_type NOT NULL,
    source_type TEXT NOT NULL, -- e.g., 'JournalEntry', 'HabitLog'
    source_id UUID NOT NULL,
    points_earned INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    points_value INTEGER NOT NULL,
    type achievement_type DEFAULT 'SYSTEM',
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements (Junction)
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JUNCTION TABLES (MANY-TO-MANY)

CREATE TABLE goal_habits (
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, habit_id)
);

CREATE TABLE goal_journals (
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    journal_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, journal_id)
);

-- 4. RLS POLICIES (Supabase / PostgreSQL)

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

-- Owner Access Policy Template
-- Profiles
CREATE POLICY "Users can manage their own profile" ON profiles 
    FOR ALL USING (auth.uid() = id);

-- Goals
CREATE POLICY "Users can manage their own goals" ON goals 
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Others (Pattern repeats)
CREATE POLICY "Users can manage their own journal" ON journal_entries 
    FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- 5. INDEXING STRATEGY

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX idx_activity_user_id ON activity_records(user_id);
CREATE INDEX idx_activity_source ON activity_records(source_type, source_id);
CREATE INDEX idx_journal_entry_date ON journal_entries(entry_date);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
```

## 2. Decision Summary Checklist

- [x] **Soft Delete**: Implemented via `deleted_at` across all primary entities.
- [x] **Cascade Behavior**: Used `ON DELETE CASCADE` specifically for junction tables and child entities (Logs, Milestones).
- [x] **Achievement Logic**: Shifted to Application Service Layer (as recommended for MVP), with schema support for `user_achievements`.
- [x] **Points Calculation**: Snapshot-based in `activity_records`, driven by a configurable `point_rules` table.
- [x] **Privacy & RLS**: 100% Private defaults, with `visibility` column prepared for future scaling to `shared`/`public`.
- [x] **Enums**: Comprehensive use of PostgreSQL Types for schema integrity.
