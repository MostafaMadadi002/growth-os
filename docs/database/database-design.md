# طراحی پایگاه‌داده (Database Design) - GrowthOS

این مستند شامل کدهای SQL برای ایجاد جداول، شاخص‌ها (Indexes) و سیاست‌های امنیتی (RLS) در Supabase است.

## ۱. جداول (Tables)

```sql
-- فعال‌سازی افزونه برای UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول اهداف بزرگ
CREATE TABLE big_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    total_expected_sessions INTEGER DEFAULT 0,
    category TEXT CHECK (category IN ('EDUCATION', 'PERSONAL', 'PROJECT')),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ON_HOLD', 'OVERDUE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول برنامه‌زمان‌بندی جلسات
CREATE TABLE goal_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES big_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    session_title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول عادات خوب
CREATE TABLE good_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    frequency TEXT DEFAULT 'DAILY' CHECK (frequency IN ('DAILY', 'WEEKLY', 'CUSTOM')),
    target_days_of_week INTEGER[],
    reminder_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول ثبت انجام عادات خوب
CREATE TABLE good_habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES good_habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'DONE' CHECK (status IN ('DONE', 'PARTIAL', 'MISSED')),
    value DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول عادات بد
CREATE TABLE bad_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('SOCIAL_MEDIA', 'GAMING', 'NEWS', 'OTHER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول ثبت اتلاف وقت عادات بد
CREATE TABLE bad_habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bad_habit_id UUID NOT NULL REFERENCES bad_habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL,
    replacement_habit_id UUID REFERENCES good_habits(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول معاملات (Trading Journal)
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    market_type TEXT NOT NULL CHECK (market_type IN ('FOREX', 'CRYPTO')),
    symbol TEXT NOT NULL,
    entry_price DOUBLE PRECISION NOT NULL,
    stop_loss DOUBLE PRECISION,
    target_price DOUBLE PRECISION,
    leverage DOUBLE PRECISION DEFAULT 1.0,
    lot_size DOUBLE PRECISION,
    fee DOUBLE PRECISION DEFAULT 0.0,
    spread DOUBLE PRECISION DEFAULT 0.0,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'WIN', 'LOSS', 'RISK_FREE')),
    reflection_reason TEXT,
    closing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول ژورنال روزانه
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    mood_emoji TEXT,
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول یادداشت‌ها
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
    tags TEXT[], 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## ۲. شاخص‌ها (Indexes)

```sql
CREATE INDEX idx_journal_date ON journal_entries (entry_date);
CREATE INDEX idx_habit_comp_date ON good_habit_completions (completed_at);
CREATE INDEX idx_bad_habit_log_date ON bad_habit_logs (log_date);
CREATE INDEX idx_trades_closing_date ON trades (closing_date);
CREATE INDEX idx_big_goals_userid ON big_goals (user_id);
CREATE INDEX idx_trades_userid ON trades (user_id);
```

## ۳. امنیت سطح ردیف (RLS)

```sql
ALTER TABLE big_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE good_habits ENABLE ROW LEVEL SECURITY;
-- ... برای تمامی جداول مشابه است ...

CREATE POLICY "Users can only see their own data" ON trades FOR ALL USING (auth.uid() = user_id);
```
