# GrowthOS System Architecture (Phase 3)

## 1. Architecture Principles

GrowthOS follows a clean, modular, and feature-first architecture to ensure scalability and maintainable code.

- **Feature-Based**: Code is organized by domain features (e.g., `features/goals`, `features/habits`) rather than technical layers (e.g., all components in one folder).
- **Service Layer**: Business logic is encapsulated in service classes/functions, preventing "fat components" and making logic reusable and testable.
- **Repository Pattern**: Data access (Supabase, Local Storage) is abstracted behind repository modules. Services interact with repositories, not directly with the database client.
- **Zustand State Management**: Global state is managed using small, focused Zustand stores. The store is the single source of truth for the UI.
- **Supabase Backend**: Fully integrated with Supabase for Authentication, Database, and Real-time capabilities.

## 2. Directory Structure

```text
src
│
├── core
│   ├── types           # Global TypeScript interfaces
│   ├── constants       # App-wide constants (Enums, Config)
│   ├── utils           # Pure helper functions
│   ├── services        # Cross-cutting business services
│   └── stores          # Cross-cutting global stores (e.g., auth)
│
├── features            # Domain-specific modules
│   ├── dashboard       # Aggregated views and summaries
│   ├── goals           # Management, milestones, progress
│   ├── habits          # Tracking, logs, streaks
│   ├── journal         # Entries, tags, attachments
│   ├── achievements    # System and user achievements
│   └── analytics       # Heatmaps, growth score, reports
│
├── shared              # Reusable assets across features
│   ├── components      # Common UI parts (Cards, Inputs)
│   ├── hooks           # Reusable React hooks
│   └── ui              # Base UI Kit (Buttons, Badges)
│
└── infrastructure      # Technical implementation details
    ├── supabase        # Supabase client and setup
    ├── storage         # Persistence adapters (Local, DB)
    └── sync            # Future: Offline sync logic
```

## 3. Store Responsibilities (Zustand)

- **`authStore`**: Manages user session, profile data, and growth points.
- **`goalStore`**: Manages the list of active goals, selected goal state, and milestone updates.
- **`habitStore`**: Manages daily habits, logs for the current view, and streak calculations.
- **`journalStore`**: Manages journal entry lists, filtering, and local drafts.
- **`dashboardStore`**: Manages the unified "Activity Canvas" state and greeting logic.
- **`achievementStore`**: Manages unlocked achievements and logic for displaying notifications.

## 4. Service Responsibilities

- **`goalService`**: Handles goal lifecycle, milestone completion logic, and linking goals to other modules.
- **`habitService`**: Handles habit creation, logging validation, and triggering streak calculations.
- **`journalService`**: Handles entry creation, tag management, and file attachment uploads.
- **`activityService`**: **The Core Engine.** Every action logs an `ActivityRecord`. It calculates points and notifies other services.
- **`achievementService`**: Evaluates `ActivityRecords` against rules to unlock achievements.

## 5. Data Flow Diagrams

### Create Goal
1. **UI**: User submits Create Goal form.
2. **GoalStore**: `addGoal` triggered.
3. **GoalService**: Validates input, determines initial markers.
4. **GoalRepository**: Performs Supabase `insert` into `goals`.
5. **ActivityService**: Logs `GOAL_CREATED` record.
6. **GoalStore**: Updates state with the new goal from DB.

### Complete Habit
1. **UI**: User clicks "Done" on a habit.
2. **HabitStore**: `logHabit` triggered.
3. **HabitService**: Checks if log already exists for today.
4. **HabitRepository**: Inserts/Updates `habit_logs`.
5. **ActivityService**: Logs `HABIT_COMPLETED` record + awards points.
6. **AchievementService**: Checks if this completes a streak (e.g., "7 Day Streak").
7. **HabitStore**: Refreshes local state.

### Create Journal Entry
1. **UI**: User saves a new journal entry.
2. **JournalStore**: `saveEntry` triggered.
3. **JournalService**: Prepares content, handles any attachments.
4. **JournalRepository**: Inserts into `journal_entries`.
5. **ActivityService**: Logs `JOURNAL_CREATED` record + awards 10 points.
6. **JournalStore**: Refreshes list.

## 6. Activity Engine Flow

The Unified Activity Engine is the backbone of GrowthOS:

```text
Action (Journal, Habit, etc.) 
      ↓
ActivityService.logAction()
      ↓
Create ActivityRecord in DB
      ↓ 
Award Growth Points (AuthStore update)
      ↓
Check Achievements (AchievementService)
      ↓
Trigger UI Celebration (if achievement unlocked)
```
