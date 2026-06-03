# GrowthOS Domain Model

## Core Entities

### 1. User
The central entity for personalization and data isolation.
- **Attributes**: id, email, display_name, profile_image, growth_points, created_at.

### 2. Goal
Long-term objectives the user wants to achieve.
- **Attributes**: id, user_id, title, description, category (EDUCATION, FITNESS, TRADING, CAREER, PERSONAL, FINANCE), level (S, A, B, C), status (ACTIVE, COMPLETED, ON_HOLD, OVERDUE), visibility, deadline, created_at, updated_at, deleted_at.
- **Relationships**: 
  - 1 -> N Milestones
  - N <-> N Habits
  - N <-> N JournalEntries
  - N <-> N Activities

### 3. Milestone
Specific, measurable steps towards a Goal.
- **Attributes**: id, goal_id, title, description, is_completed, deadline, created_at.
- **Relationships**:
  - 1 -> N ProgressRecords

### 4. ProgressRecord
Granular tracking of progress for a specific milestone.
- **Attributes**: id, milestone_id, value, notes, date.

### 5. Habit
Recurring behaviors to support Goals or personal growth.
- **Attributes**: id, user_id, title, frequency (DAILY, WEEKLY), type (BINARY, QUANTITATIVE), is_good, visibility, current_streak, best_streak, created_at, deleted_at.
- **Relationships**:
  - 1 -> N HabitLogs
  - N <-> N Goals (via junction table)

### 6. HabitLog
The daily execution record of a Habit.
- **Attributes**: id, habit_id, status (DONE, SKIP, FAIL), value, date.

### 7. JournalEntry
Daily reflections, notes, or logs.
- **Attributes**: id, user_id, content, mood, tags, date, visibility, created_at, updated_at, deleted_at.
- **Relationships**:
  - 1 -> N Attachments
  - N <-> N Goals (via junction table)

### 8. Attachment
Media or files associated with entries.
- **Attributes**: id, parent_id, parent_type (JOURNAL, TRADE, NOTE), file_name, file_type, url, size, created_at.
- **Polymorphic**: Designed to be attached to various entity types.

### 9. ActivityRecord (Core Event Engine)
A unified record of all significant actions within the app.
- **Attributes**: id, user_id, title, event_type (JOURNAL_CREATED, HABIT_COMPLETED, GOAL_COMPLETED, MILESTONE_COMPLETED, WORKOUT_LOGGED, TRADE_REVIEWED, CUSTOM), source_type, source_id, points_earned, date, created_at, deleted_at, metadata (JSON).
- **Purpose**: Feeds the Heatmap, Growth Score, and Achievement systems.

### 10. Achievement
Rewards for reaching specific triggers.
- **Attributes**: id, title, description, category (GOAL, HABIT, CONSISTENCY, MILESTONE), icon, points_value, type (SYSTEM, USER).
- **Relationships**:
  - N <-> N Users (Unlocked achievements)

## Key Architectural Decisions

1. **Many-to-Many Linking**: Goals can be linked to multiple Habits, Journal Entries, and Activities. This reflects real-world complexity where one action contributes to multiple objectives.
2. **Polymorphic Attachments**: Attachments are designed to support any entity type (Journals today, Trades/Notes tomorrow).
3. **Unified Activity Engine**: The `ActivityRecord` is the primary source of truth for analytics and gamification.
4. **Progress via Milestones**: Quantitative progress is tracked at the Milestone level, which aggregates into Goal completion.
5. **Growth Points**: Every meaningful action (ActivityRecord) and achievement grants Growth Points, powering the user's level and progression.
