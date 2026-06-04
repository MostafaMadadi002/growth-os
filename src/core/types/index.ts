export enum MarketType {
  FOREX = 'FOREX',
  CRYPTO = 'CRYPTO',
  STOCKS = 'STOCKS',
}

export enum TradeStatus {
  OPEN = 'OPEN',
  WIN = 'WIN',
  LOSS = 'LOSS',
  RISK_FREE = 'RISK_FREE',
}

export enum HabitStatus {
  DONE = 'DONE',
  PARTIAL = 'PARTIAL',
  MISSED = 'MISSED',
}

export enum HabitType {
  BINARY = 'BINARY',
  QUANTITATIVE = 'QUANTITATIVE'
}

export type Visibility = 'private' | 'shared' | 'public';

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  type: HabitType;
  target_value?: number;
  unit?: string;
  is_good: boolean;
  frequency: 'DAILY' | 'WEEKLY';
  goal_id?: string;
  visibility?: Visibility;
  created_at?: string;
  deleted_at?: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  value?: number;
  status: HabitStatus;
  date: string;
}

export enum GoalLevel {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME'
}

export interface Milestone {
  id: string;
  goal_id?: string;
  title: string;
  is_completed: boolean;
  target_date?: string;
  created_at?: string;
  deleted_at?: string;
}

export interface BigGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  level: GoalLevel;
  milestones: Milestone[];
  start_date: string;
  end_date?: string;
  category: 'EDUCATION' | 'PERSONAL' | 'FITNESS' | 'TRADING' | 'CAREER' | 'FINANCE';
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'OVERDUE';
  visibility?: Visibility;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface GoalSession {
  id: string;
  goal_id: string;
  session_number: number;
  date?: string;
  is_completed: boolean;
  reflection?: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  course_id?: string;
  title: string;
  category: string; // Course, Book, etc.
  duration_minutes: number;
  date: string;
  notes?: string;
}

export interface Course {
  id: string;
  user_id: string;
  title: string;
  units: number;
  total_sessions: number;
  sessions_per_week: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  type: string;
  duration: number;
  calories?: number;
  date: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  weight: number;
  body_fat?: number;
  date: string;
}

export enum TradeDirection {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export interface Trade {
  id: string;
  user_id: string;
  market_type: MarketType;
  symbol: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  target_price?: number;
  leverage?: number;
  lot_size?: number;
  risk_percent?: number;
  position_size?: number;
  rr_ratio?: number;
  fee?: number;
  spread?: number;
  volume_base?: number; // Volume without leverage
  pnl_amount?: number;  // Profit/Loss amount
  status: TradeStatus;
  
  // Psychology
  emotion_before?: string;
  emotion_after?: string;
  confidence_level?: number; // 1-10
  mistake_type?: string;

  // Reflection
  reflection_reason?: string;
  trade_thesis?: string;
  what_went_well?: string;
  what_went_wrong?: string;
  lesson_learned?: string;

  entry_date: string;
  closing_date?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  entry_date: string;
  mood: number;
  energy: number;
  gratitude?: string;
  achievement?: string;
  challenge?: string;
  lesson?: string;
  tags: string[];
  goal_id?: string;
  attachments?: Attachment[];
  visibility?: Visibility;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Attachment {
  id: string;
  parent_id: string;
  parent_type: 'JOURNAL' | 'TRADE' | 'NOTE' | 'ACTIVITY';
  file_name: string;
  file_type: string;
  url: string;
  size: number;
  uploaded_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'GOAL' | 'HABIT' | 'CONSISTENCY' | 'MILESTONE' | 'TRADING';
  icon_name?: string;
  points_value: number;
  type: 'SYSTEM' | 'USER';
  unlocked_at: string;
  goal_id?: string;
  deleted_at?: string;
}

export type ActivityEventType = 
  | 'JOURNAL_CREATED' 
  | 'HABIT_COMPLETED' 
  | 'GOAL_COMPLETED' 
  | 'MILESTONE_COMPLETED' 
  | 'WORKOUT_LOGGED' 
  | 'TRADE_REVIEWED' 
  | 'CUSTOM';

export interface ActivityRecord {
  id: string;
  user_id: string;
  title: string;
  event_type: ActivityEventType;
  source_type: string; // e.g., 'JournalEntry', 'HabitLog'
  source_id: string;   // e.g., 'journal_123'
  points_earned: number;
  date: string;
  goal_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  deleted_at?: string;
}

export interface ProgressRecord {
  id: string;
  milestone_id: string;
  value: number;
  notes?: string;
  date: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags?: string[];
  last_edited_at: string;
  created_at: string;
}
