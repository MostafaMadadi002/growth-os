import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Activity, Trash2, X, BarChart3, Globe, Bitcoin, LineChart } from 'lucide-react';
import { useTradingStore } from './stores/tradingStore';
import { MarketType, TradeStatus, Trade } from '../../core/types';

export default function TradingScreen() {
  const { trades, fetchTrades, addTrade, removeTrade } = useTradingStore();
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
    await addTrade({
      ...newTrade,
      entry_date: new Date().toISOString()
    } as any);
    setShowAdd(false);
  };

  const getStatusColor = (status: TradeStatus) => {
    switch (status) {
      case TradeStatus.WIN: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case TradeStatus.LOSS: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const winCount = trades.filter(t => t.status === TradeStatus.WIN).length;
  const winRate = trades.length > 0 ? Math.round((winCount / trades.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6" dir="rtl">
      <header className="mb-10 flex justify-between items-center text-right">
        <h1 className="text-4xl font-black text-white tracking-tight">Trading Journal</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 p-4 rounded-2xl text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-10">
         <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <BarChart3 size={60} />
           </div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Win Rate</span>
           <span className="text-4xl font-black text-emerald-500 tracking-tighter">{winRate}%</span>
         </div>
         <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Activity size={60} />
           </div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Total Ops</span>
           <span className="text-4xl font-black text-blue-500 tracking-tighter">{trades.length}</span>
         </div>
      </div>

      <main className="space-y-4 flex-1 overflow-y-auto pb-32 scrollbar-hide">
        {trades.map(t => (
          <div key={t.id} className="bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-slate-850 transition-all">
             <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusColor(t.status)}`}>
                   {t.status === TradeStatus.WIN ? <TrendingUp size={28} /> : t.status === TradeStatus.LOSS ? <TrendingDown size={28} /> : <LineChart size={28} />}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black text-white tracking-tight">{t.symbol}</h3>
                  <div className="flex gap-3 mt-1">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type: {t.market_type}</span>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry: ${t.entry_price}</span>
                  </div>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <span className={`text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full border ${getStatusColor(t.status)}`}>
                   {t.status}
                </span>
                <button onClick={() => removeTrade(t.id)} className="p-3 bg-red-500/10 text-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white">
                  <Trash2 size={20} />
                </button>
             </div>
          </div>
        ))}
        {trades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
             <Globe size={80} className="mb-6" />
             <p className="text-lg font-black uppercase tracking-widest text-center">Market Analysis Void</p>
          </div>
        )}
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/5 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
            <h3 className="text-2xl font-black text-white mb-10 text-center tracking-tight">Log Market Operation</h3>
            
            <div className="space-y-6 mb-12">
              <div className="grid grid-cols-2 gap-4">
                 <select 
                   value={newTrade.market_type}
                   onChange={e => setNewTrade({...newTrade, market_type: e.target.value as MarketType})}
                   className="bg-slate-850 border border-white/5 rounded-2xl p-4 text-white outline-none font-black text-xs appearance-none text-center"
                 >
                   <option value={MarketType.CRYPTO}>Crypto</option>
                   <option value={MarketType.FOREX}>Forex</option>
                   <option value={MarketType.STOCKS}>Stocks</option>
                 </select>
                 <select 
                   value={newTrade.status}
                   onChange={e => setNewTrade({...newTrade, status: e.target.value as TradeStatus})}
                   className="bg-slate-850 border border-white/5 rounded-2xl p-4 text-white outline-none font-black text-xs appearance-none text-center"
                 >
                   <option value={TradeStatus.OPEN}>Active</option>
                   <option value={TradeStatus.WIN}>Win</option>
                   <option value={TradeStatus.LOSS}>Loss</option>
                 </select>
              </div>

              <input 
                placeholder="Asset (e.g., BTC/USDT)"
                value={newTrade.symbol}
                onChange={e => setNewTrade({...newTrade, symbol: e.target.value.toUpperCase()})}
                className="w-full bg-slate-850 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-emerald-500 font-bold text-center"
              />
              <input 
                type="number"
                placeholder="Entry Execution Price"
                value={newTrade.entry_price || ''}
                onChange={e => setNewTrade({...newTrade, entry_price: parseFloat(e.target.value)})}
                className="w-full bg-slate-850 border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-emerald-500 font-bold text-center"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAdd} 
                className="flex-[2] bg-emerald-500 py-5 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                Log Operation
              </button>
              <button 
                onClick={() => setShowAdd(false)} 
                className="flex-1 bg-slate-800 py-5 rounded-2xl font-black text-slate-500 uppercase tracking-widest"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
