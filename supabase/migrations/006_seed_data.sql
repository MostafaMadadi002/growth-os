-- 006_seed_data.sql

-- Initial Point Rules
INSERT INTO point_rules (event_type, points_value) VALUES
('JOURNAL_CREATED', 10),
('HABIT_COMPLETED', 5),
('GOAL_COMPLETED', 100),
('MILESTONE_COMPLETED', 25),
('WORKOUT_LOGGED', 15),
('TRADE_REVIEWED', 20),
('CUSTOM', 1);

-- Initial System Achievements
INSERT INTO achievements (title, description, points_value, type, icon_name) VALUES
('First Step', 'Created your first goal', 50, 'SYSTEM', 'target'),
('Journalist', 'Wrote your first journal entry', 50, 'SYSTEM', 'book'),
('Consistent', 'Completed a habit 7 days in a row', 150, 'SYSTEM', 'award'),
('Master', 'Completed an S-level goal', 500, 'SYSTEM', 'trophy');
