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
  created_at: string;
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
  title: string;
  is_completed: boolean;
  target_date?: string;
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
  category: 'EDUCATION' | 'PERSONAL' | 'PROJECT' | 'FITNESS' | 'TRADING';
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'OVERDUE';
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
  title: string;
  category: string; // Course, Book, etc.
  duration_minutes: number;
  date: string;
  notes?: string;
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

export interface Trade {
  id: string;
  user_id: string;
  market_type: MarketType;
  symbol: string;
  entry_price: number;
  stop_loss?: number;
  target_price?: number;
  leverage?: number;
  lot_size?: number;
  fee?: number;
  spread?: number;
  status: TradeStatus;
  reflection_reason?: string;
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
}

export interface Attachment {
  id: string;
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
  category: 'GOAL' | 'HABIT' | 'CONSISTENCY' | 'MILESTONE';
  icon_name?: string;
  unlocked_at: string;
  goal_id?: string;
}

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  type: 'LEARNING' | 'WORKOUT' | 'TRADING' | 'CUSTOM';
  duration_minutes?: number;
  points_earned: number;
  date: string;
  goal_id?: string;
}

export interface ProgressRecord {
  id: string;
  goal_id: string;
  milestone_id?: string;
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
