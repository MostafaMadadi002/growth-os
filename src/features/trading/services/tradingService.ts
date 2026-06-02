import { supabase } from '../../../core/services/supabase';
import { Trade, MarketType, TradeStatus } from '../../../core/types';

const TRADING_LOCAL = 'growthos_trading_backup';

const getTrades = () => JSON.parse(localStorage.getItem(TRADING_LOCAL) || '[]');
const saveTrades = (t: any) => localStorage.setItem(TRADING_LOCAL, JSON.stringify(t));

export const tradingService = {
  async getAllTrades() {
    try {
      const { data, error } = await supabase.from('trades').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Trade[];
    } catch (e) {
      return getTrades();
    }
  },

  async createTrade(trade: Omit<Trade, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { data, error } = await supabase.from('trades').insert([{ ...trade, user_id: user.id, created_at: new Date().toISOString() }]).select().single();
      if (error) throw error;
      return data as Trade;
    } catch (e) {
      const t = { ...trade, id: Math.random().toString(36).substring(2,11), user_id: 'guest', created_at: new Date().toISOString() };
      saveTrades([t, ...getTrades()]);
      return t;
    }
  },

  async updateTrade(id: string, updates: Partial<Trade>) {
    try {
      const { data, error } = await supabase.from('trades').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Trade;
    } catch (e) {
      const trades = getTrades();
      const idx = trades.findIndex((x:any) => x.id === id);
      if (idx > -1) {
        trades[idx] = { ...trades[idx], ...updates };
        saveTrades(trades);
        return trades[idx];
      }
      throw e;
    }
  },

  async deleteTrade(id: string) {
    try {
      const { error } = await supabase.from('trades').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      saveTrades(getTrades().filter((x:any) => x.id !== id));
    }
  }
};
