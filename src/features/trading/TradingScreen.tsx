import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Activity, Trash2, Edit3, X } from 'lucide-react';
import { useTradingStore } from './store/useTradingStore';
import { MarketType, TradeStatus, Trade } from '../../core/types';

export default function TradingScreen() {
  const { trades, fetchTrades, addTrade, updateTrade, removeTrade } = useTradingStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    market_type: MarketType.CRYPTO,
    symbol: '',
    entry_price: 0,
    status: TradeStatus.OPEN
  });

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const handleAdd = async () => {
    if (!newTrade.symbol || !newTrade.entry_price) return;
    await addTrade(newTrade as any);
    setShowAdd(false);
  };

  const calculatePnl = (trade: Trade) => {
    // Simplified PNL
    if (trade.status === TradeStatus.WIN) return "+15%";
    if (trade.status === TradeStatus.LOSS) return "-10%";
    return "باز";
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6" dir="rtl">
      <header className="mb-10 flex justify-between items-center text-right">
        <h1 className="text-4xl font-black text-white">معاملات</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <span className="text-slate-500 text-sm mb-1 block">نرخ برد</span>
           <span className="text-3xl font-black text-emerald-500">۶۸٪</span>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
           <span className="text-slate-500 text-sm mb-1 block">سود کل</span>
           <span className="text-3xl font-black text-blue-500">+$۱۲۴۰</span>
         </div>
      </div>

      <main className="space-y-4 flex-1 overflow-y-auto pb-24">
        {trades.map(t => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between group">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.status === TradeStatus.WIN ? 'bg-emerald-500/10 text-emerald-500' : t.status === TradeStatus.LOSS ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                   {t.status === TradeStatus.WIN ? <TrendingUp size={24} /> : t.status === TradeStatus.LOSS ? <TrendingDown size={24} /> : <Activity size={24} />}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-white">{t.symbol}</h3>
                  <p className="text-sm text-slate-500">ورود: {t.entry_price}</p>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <span className={`text-xl font-black ${t.status === TradeStatus.WIN ? 'text-emerald-500' : t.status === TradeStatus.LOSS ? 'text-red-500' : 'text-slate-400'}`}>
                   {calculatePnl(t)}
                </span>
                <button onClick={() => removeTrade(t.id)} className="p-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">
                  <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">معامله جدید</h3>
            
            <div className="space-y-4 mb-8">
              <input 
                placeholder="نماد (مثلاً BTC/USDT)"
                value={newTrade.symbol}
                onChange={e => setNewTrade({...newTrade, symbol: e.target.value.toUpperCase()})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
              />
              <input 
                type="number"
                placeholder="قیمت ورود"
                value={newTrade.entry_price || ''}
                onChange={e => setNewTrade({...newTrade, entry_price: parseFloat(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right"
              />
              <select 
                value={newTrade.status}
                onChange={e => setNewTrade({...newTrade, status: e.target.value as TradeStatus})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 text-right appearance-none"
              >
                <option value={TradeStatus.OPEN}>باز</option>
                <option value={TradeStatus.WIN}>برد (Win)</option>
                <option value={TradeStatus.LOSS}>باخت (Loss)</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button onClick={handleAdd} className="flex-[2] bg-emerald-500 py-4 rounded-2xl font-bold text-white">ثبت</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold text-slate-400">لغو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
