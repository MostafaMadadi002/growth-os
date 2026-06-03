import React, { useState, useEffect } from 'react';
import { 
  Plus, TrendingUp, TrendingDown, Activity, Trash2, X, BarChart3, 
  Globe, Bitcoin, LineChart, Target, AlertTriangle, Wallet, ScaleChart, Edit3, 
  ChevronDown, ChevronUp, History, Zap, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { useTradingStore } from './stores/tradingStore';
import { MarketType, TradeStatus, Trade } from '../../core/types';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

export default function TradingScreen() {
  const { trades, fetchTrades, addTrade, removeTrade, updateTrade } = useTradingStore();
  const { t, dir } = useI18n();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [reportRange, setReportRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    market_type: MarketType.CRYPTO,
    symbol: '',
    entry_price: 0,
    stop_loss: 0,
    target_price: 0,
    leverage: 1,
    lot_size: 0.01,
    fee: 0,
    spread: 0,
    volume_base: 0,
    status: TradeStatus.OPEN,
    reflection_reason: ''
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
    resetForm();
  };

  const resetForm = () => {
    setNewTrade({
      market_type: MarketType.CRYPTO,
      symbol: '',
      entry_price: 0,
      stop_loss: 0,
      target_price: 0,
      leverage: 1,
      lot_size: 0.01,
      fee: 0,
      spread: 0,
      volume_base: 0,
      status: TradeStatus.OPEN,
      reflection_reason: ''
    });
  };

  const getStatusColor = (status: TradeStatus) => {
    switch (status) {
      case TradeStatus.WIN: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case TradeStatus.LOSS: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case TradeStatus.RISK_FREE: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const calculateStats = () => {
    const finished = trades.filter(t => t.status !== TradeStatus.OPEN);
    const wins = finished.filter(t => t.status === TradeStatus.WIN).length;
    const losses = finished.filter(t => t.status === TradeStatus.LOSS).length;
    const winRate = finished.length > 0 ? Math.round((wins / finished.length) * 100) : 0;
    
    // Simple profit/loss simulation if pnl not recorded
    const totalPnl = trades.reduce((acc, t) => acc + (t.pnl_amount || 0), 0);
    const openPositions = trades.filter(t => t.status === TradeStatus.OPEN).length;
    const cryptoOps = trades.filter(t => t.market_type === MarketType.CRYPTO).length;
    const forexOps = trades.filter(t => t.market_type === MarketType.FOREX).length;
    
    return { winRate, totalOps: trades.length, totalPnl, wins, losses, openPositions, cryptoOps, forexOps };
  };

  const stats = calculateStats();

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden data-grid" dir={dir}>
      <header className="mb-10 flex justify-between items-end mr-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">Market Intelligence // Op_Flow</span>
          </div>
          <h1 className="text-6xl font-display font-black text-white tracking-tighter">{t('market_matrix')}.</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-brand-secondary w-16 h-16 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl shadow-brand-secondary/20 active:scale-95 transition-all hover:scale-105"
        >
          <Plus size={32} />
        </button>
      </header>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="command-card relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-emerald-500">
              <TrendingUp size={64} />
           </div>
           <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mb-4 block">Win_Execution_Ratio</span>
           <div className="flex items-baseline gap-4">
              <span className="text-5xl font-mono font-black text-emerald-500 tracking-tighter">{stats.winRate}%</span>
              <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">Efficiency</span>
           </div>
         </div>
         
         <div className="command-card relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-blue-500">
              <Activity size={64} />
           </div>
           <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mb-4 block">Total_Active_Exposure</span>
           <div className="flex items-baseline gap-4">
              <span className="text-5xl font-mono font-black text-blue-500 tracking-tighter">{stats.totalOps}</span>
              <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">Active_Nodes</span>
           </div>
         </div>

         <div className="command-card relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-brand-primary">
              <Wallet size={64} />
           </div>
           <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mb-4 block">{t('pnl')}</span>
           <div className="flex items-baseline gap-4">
              <span className={`text-5xl font-mono font-black tracking-tighter ${stats.totalPnl >= 0 ? 'text-brand-primary' : 'text-rose-500'}`}>
                {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(1)}$
              </span>
              <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">{t('operational')} NET</span>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
         <div className="command-card !py-4 flex justify-between items-center group">
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase transition-colors group-hover:text-slate-400">{t('open')}</span>
            <span className="text-xl font-mono font-black text-blue-500">{stats.openPositions}</span>
         </div>
         <div className="command-card !py-4 flex justify-between items-center group">
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase transition-colors group-hover:text-slate-400">{t('crypto')}</span>
            <span className="text-xl font-mono font-black text-orange-500">{stats.cryptoOps}</span>
         </div>
         <div className="command-card !py-4 flex justify-between items-center group">
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase transition-colors group-hover:text-slate-400">{t('forex')}</span>
            <span className="text-xl font-mono font-black text-emerald-500">{stats.forexOps}</span>
         </div>
         <div className="command-card !py-4 flex justify-between items-center group">
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase transition-colors group-hover:text-slate-400">{t('total_ops')}</span>
            <span className="text-xl font-mono font-black text-white">{stats.totalOps}</span>
         </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
         <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map(range => (
              <button 
                key={range}
                onClick={() => setReportRange(range)}
                className={`px-6 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition-all ${reportRange === range ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {t(range.toLowerCase())}
              </button>
            ))}
         </div>
         <div className="h-px flex-1 bg-white/[0.03]" />
         <div className="text-[9px] font-mono font-bold text-slate-700 uppercase tracking-[0.2em]">{trades.length} REGISTERED_PROTOCOLS</div>
      </div>

      <main className="space-y-6 flex-1 overflow-y-auto pb-32 scrollbar-hide pr-2">
        {trades.map((t, idx) => (
          <motion.div 
            key={t.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedTrade(t)}
            className="command-card cursor-pointer group hover:bg-slate-900/80 transition-all flex flex-col md:flex-row gap-8 items-center"
          >
             <div className="flex items-center gap-8 flex-1">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all group-hover:scale-105 ${getStatusColor(t.status)}`}>
                   {t.status === TradeStatus.WIN ? <TrendingUp size={36} strokeWidth={2.5} /> : t.status === TradeStatus.LOSS ? <TrendingDown size={36} strokeWidth={2.5} /> : <Activity size={36} strokeWidth={2.5} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-3xl font-display font-black text-white tracking-tighter group-hover:text-brand-secondary transition-colors uppercase">
                      {t.symbol}
                    </h3>
                    <span className="text-[9px] font-mono font-black text-slate-700 bg-slate-950 px-3 py-1 rounded-sm border border-white/5">{t.market_type}</span>
                  </div>
                  <div className="flex flex-wrap gap-6 mt-3">
                     <TradeStat label="Entry_Point" value={t.entry_price.toString()} icon={<Target size={12} />} />
                     <TradeStat label="Stop_Loss" value={t.stop_loss?.toString() || '0'} color="text-rose-500" icon={<AlertTriangle size={12} />} />
                     <TradeStat label="Target_Exit" value={t.target_price?.toString() || '0'} color="text-emerald-500" icon={<Zap size={12} />} />
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-8 border-l border-white/5 pl-8 h-16">
                <div className="text-right">
                   <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest block mb-1">Leverage // Vol</span>
                   <span className="text-lg font-mono font-black text-white">{t.leverage || '1'}x // {t.lot_size || '0'}</span>
                </div>
                <div className="w-px h-10 bg-white/5" />
                <div className={`w-32 py-3 rounded-xl border flex items-center justify-center text-[10px] font-mono font-black uppercase tracking-[0.2em] shadow-lg ${getStatusColor(t.status)}`}>
                   {t.status}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTrade(t.id); }} 
                  className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
             </div>
          </motion.div>
        ))}
        
        {trades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-slate-850">
             <Bitcoin size={140} strokeWidth={0.5} className="mb-12 opacity-10" />
             <p className="text-[11px] font-mono font-black uppercase tracking-[0.6em] opacity-30">Market Void // No Active Deployments Detected</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/[0.05] w-full max-w-4xl rounded-[3rem] p-16 shadow-2xl relative overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
              <button 
                onClick={() => setShowAdd(false)} 
                className="absolute top-12 right-12 w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>

              <div className="mb-12">
                 <span className="text-[10px] font-mono font-black text-brand-secondary uppercase tracking-[0.4em] mb-4 block">Market Deployment Initialization</span>
                 <h3 className="text-5xl font-display font-black text-white tracking-tighter">Deploy Operation.</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('operating_domain') || 'OPERATING_DOMAIN'}</label>
                      <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-950 rounded-2xl border border-white/[0.03]">
                        {Object.values(MarketType).map(m => (
                          <button 
                            key={m}
                            onClick={() => setNewTrade({...newTrade, market_type: m})}
                            className={`py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${newTrade.market_type === m ? 'bg-brand-secondary text-slate-950 shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            {t(m.toLowerCase())}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('status') || 'EXECUTION_STATUS'}</label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-white/[0.03]">
                        {Object.values(TradeStatus).map(s => (
                          <button 
                            key={s}
                            onClick={() => setNewTrade({...newTrade, status: s})}
                            className={`py-3 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest transition-all ${newTrade.status === s ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            {t(s.toLowerCase())}
                          </button>
                        ))}
                      </div>
                   </div>

                   <InputField label={t('symbol') || 'Asset_Symbol'} value={newTrade.symbol!} placeholder="e.g. BTC_USDT" onChange={v => setNewTrade({...newTrade, symbol: v.toUpperCase()})} />
                   <InputField label={t('entry_price') || 'Execution_Entry'} value={newTrade.entry_price?.toString() || ''} type="number" placeholder="0.00" onChange={v => setNewTrade({...newTrade, entry_price: parseFloat(v)})} />
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-6">
                      <InputField label={t('stop_loss')} value={newTrade.stop_loss?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, stop_loss: parseFloat(v)})} color="focus:border-rose-500/30" />
                      <InputField label={t('take_profit')} value={newTrade.target_price?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, target_price: parseFloat(v)})} color="focus:border-emerald-500/30" />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <InputField label={newTrade.market_type === MarketType.CRYPTO ? t('leverage') : t('lot')} value={(newTrade.market_type === MarketType.CRYPTO ? newTrade.leverage : newTrade.lot_size)?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, [newTrade.market_type === MarketType.CRYPTO ? 'leverage' : 'lot_size']: parseFloat(v)})} />
                      <InputField label={newTrade.market_type === MarketType.CRYPTO ? t('commission') : t('spread')} value={(newTrade.market_type === MarketType.CRYPTO ? newTrade.fee : newTrade.spread)?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, [newTrade.market_type === MarketType.CRYPTO ? 'fee' : 'spread']: parseFloat(v)})} />
                   </div>

                   <InputField label={t('volume')} value={newTrade.volume_base?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, volume_base: parseFloat(v)})} />
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('reason')}</label>
                      <textarea 
                        value={newTrade.reflection_reason}
                        onChange={e => setNewTrade({...newTrade, reflection_reason: e.target.value})}
                        placeholder={t('reason_placeholder') || "Define outcome causality..."}
                        className="w-full bg-slate-950 border border-white/[0.03] rounded-3xl p-6 text-slate-300 text-sm font-medium h-32 focus:border-brand-secondary/30 outline-none resize-none"
                      />
                   </div>
                </div>
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={handleAdd}
                  disabled={!newTrade.symbol || !newTrade.entry_price}
                  className="flex-[2] bg-brand-secondary hover:bg-blue-400 disabled:opacity-30 text-slate-950 font-mono font-black uppercase tracking-[0.2em] py-8 rounded-[2rem] transition-all shadow-2xl shadow-brand-secondary/20 active:scale-95"
                >
                  {t('commit_data')}
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-800 py-8 rounded-[2rem] font-mono font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                >
                  {t('abort_action')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TradeStat({ label, value, color = "text-white", icon }: { label: string, value: string, color?: string, icon: any }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-white/5 ${color}`}>{icon}</div>
       <div>
          <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest block">{label}</span>
          <span className={`text-xs font-mono font-black ${color}`}>{value}</span>
       </div>
    </div>
  );
}

function InputField({ label, value, placeholder, onChange, type = "text", color = "focus:border-brand-secondary/30" }: { label: string, value: string, placeholder?: string, onChange: (v: string) => void, type?: string, color?: string }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-6 text-white text-xl font-black outline-none transition-all placeholder:text-slate-850 ${color}`}
      />
    </div>
  );
}
