export enum MarketType {
  FOREX = 'FOREX',
  CRYPTO = 'CRYPTO',
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

export interface BigGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  total_expected_sessions: number;
  category: 'EDUCATION' | 'PERSONAL' | 'PROJECT';
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'OVERDUE';
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
  entry_date: string;
  content: string;
  mood_emoji?: string;
  energy_level?: number;
}
