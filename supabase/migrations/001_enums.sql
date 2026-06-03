-- 001_enums.sql
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
