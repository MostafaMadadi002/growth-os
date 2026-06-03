import { create } from 'zustand';
import { Trade } from '../../../core/types';
import { tradingService } from '../services/tradingService';
import { activityService } from '../../../core/services/activityService';

interface TradingState {
  trades: Trade[];
  isLoading: boolean;
  fetchTrades: () => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTrade: (id: string, updates: Partial<Trade>) => Promise<void>;
  removeTrade: (id: string) => Promise<void>;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  trades: [],
  isLoading: false,
  
  fetchTrades: async () => {
    set({ isLoading: true });
    const trades = await tradingService.getAllTrades();
    set({ trades, isLoading: false });
  },

  addTrade: async (trade) => {
    const t = await tradingService.createTrade(trade);
    
    await activityService.logActivity(
      'TRADE_REVIEWED',
      'Trade',
      t.id,
      `Market Operation: ${t.symbol}`,
      { symbol: t.symbol, type: t.market_type }
    );

    set({ trades: [t, ...get().trades] });
  },

  updateTrade: async (id, updates) => {
    const updated = await tradingService.updateTrade(id, updates);
    set({ trades: get().trades.map(t => t.id === id ? updated : t) });
  },

  removeTrade: async (id) => {
    await tradingService.deleteTrade(id);
    set({ trades: get().trades.filter(t => t.id !== id) });
  }
}));
