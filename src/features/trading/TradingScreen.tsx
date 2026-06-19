import React, { useState, useEffect } from 'react';
import { 
  Plus, TrendingUp, TrendingDown, Activity, Trash2, X, BarChart3, 
  Globe, Bitcoin, LineChart, Target, AlertTriangle, Wallet, Edit3, 
  ChevronDown, ChevronUp, History, Zap, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { useTradingStore } from './stores/tradingStore';
import { MarketType, TradeStatus, Trade, TradeDirection } from '../../core/types';
import { useI18n } from '../../core/store/useI18n';
import { motion, AnimatePresence } from 'motion/react';

const EMOTIONS = ['calm', 'fear', 'greed', 'neutral_mood'];

export default function TradingScreen() {
  const { trades, fetchTrades, addTrade, removeTrade, updateTrade } = useTradingStore();
  const { t, dir } = useI18n();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTrade, setEditTrade] = useState<Partial<Trade>>({});
  const [reportRange, setReportRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    market_type: MarketType.CRYPTO,
    symbol: '',
    direction: TradeDirection.LONG,
    entry_price: 0,
    stop_loss: 0,
    target_price: 0,
    leverage: 1,
    lot_size: 0.01,
    fee: 0,
    spread: 0,
    volume_base: 0,
    risk_percent: 1,
    confidence_level: 5,
    emotion_before: 'calm',
    trade_thesis: '',
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
      direction: TradeDirection.LONG,
      entry_price: 0,
      stop_loss: 0,
      target_price: 0,
      leverage: 1,
      lot_size: 0.01,
      fee: 0,
      spread: 0,
      volume_base: 0,
      risk_percent: 1,
      confidence_level: 5,
      emotion_before: 'calm',
      trade_thesis: '',
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
    
    const totalPnl = trades.reduce((acc, t) => acc + Number(t.pnl_amount || 0), 0);
    const openPositions = trades.filter(t => t.status === TradeStatus.OPEN).length;
    
    // Advanced Metrics
    const avgRR = finished.reduce((sum, t) => sum + (t.rr_ratio || 0), 0) / (finished.length || 1);
    const emotions = finished.reduce((acc, t) => {
        const e = t.emotion_before || 'neutral_mood';
        acc[e] = (acc[e] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const dominantEmotion = Object.entries(emotions).sort((a,b) => b[1]-a[1])[0]?.[0] || '---';

    const cryptoOps = trades.filter(t => t.market_type === MarketType.CRYPTO).length;
    const forexOps = trades.filter(t => t.market_type === MarketType.FOREX).length;

    return { 
      winRate, 
      totalOps: trades.length, 
      totalPnl, 
      wins, 
      losses, 
      openPositions,
      avgRR: avgRR.toFixed(2),
      dominantEmotion: dominantEmotion,
      cryptoOps,
      forexOps
    };
  };

  const stats = calculateStats();

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 md:p-12 overflow-y-auto pb-40 scrollbar-hide data-grid" dir={dir}>
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">{t('market_intel')}</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-display font-black text-white tracking-tighter">{t('market_matrix')}.</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-brand-secondary w-full md:w-16 h-14 md:h-16 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl shadow-brand-secondary/20 active:scale-95 transition-all hover:scale-105"
        >
          <Plus size={24} md:size={32} />
        </button>
      </header>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="command-card relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-emerald-500">
              <TrendingUp size={64} />
           </div>
           <span className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mb-3 md:mb-4 block">{t('win_ratio_label') || 'Win_Execution_Ratio'}</span>
           <div className="flex items-baseline gap-3 md:gap-4">
              <span className="text-3xl md:text-5xl font-mono font-black text-emerald-500 tracking-tighter">{stats.winRate}%</span>
              <span className="text-[8px] md:text-[10px] font-mono text-slate-700 uppercase tracking-widest">{t('efficiency_label')}</span>
           </div>
         </div>
         
         <div className="command-card relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-blue-500">
              <Activity size={64} />
           </div>
           <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mb-4 block">{t('active_exposure') || 'Total_Active_Exposure'}</span>
           <div className="flex items-baseline gap-4">
              <span className="text-3xl md:text-5xl font-mono font-black text-blue-500 tracking-tighter">{stats.totalOps}</span>
              <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">{t('active_nodes_label')}</span>
           </div>
         </div>

         <div className="command-card relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-all text-brand-primary">
              <Wallet size={64} />
           </div>
           <span className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mb-4 block">{t('pnl')}</span>
           <div className="flex items-baseline gap-4">
              <span className={`text-3xl md:text-5xl font-mono font-black tracking-tighter ${stats.totalPnl >= 0 ? 'text-brand-primary' : 'text-rose-500'}`}>
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
         <div className="text-[9px] font-mono font-bold text-slate-700 uppercase tracking-[0.2em]">{trades.length} {t('registered_protocols_label')}</div>
      </div>

      <main className="space-y-4 md:space-y-6 flex-1 pr-2">
        {trades.map((trade, idx) => (
          <motion.div 
            key={trade.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              setSelectedTrade(trade);
              setEditTrade(trade);
              setIsEditing(false);
            }}
            className="command-card cursor-pointer group hover:bg-slate-950/80 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-center !p-6 shadow-2xl shadow-brand-primary/[0.02]"
          >
             <div className="flex items-center gap-6 md:gap-8 flex-1">
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all group-hover:scale-105 shrink-0 ${getStatusColor(trade.status)}`}>
                   {trade.status === TradeStatus.WIN ? <TrendingUp size={24} md:size={36} strokeWidth={2.5} /> : trade.status === TradeStatus.LOSS ? <TrendingDown size={24} md:size={36} strokeWidth={2.5} /> : <Activity size={24} md:size={36} strokeWidth={2.5} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 md:gap-4 mb-2">
                    <h3 className="text-xl md:text-3xl font-display font-black text-white tracking-tighter group-hover:text-brand-secondary transition-colors uppercase">
                      {trade.symbol}
                    </h3>
                    <div className="flex gap-2">
                       <span className="text-[8px] md:text-[9px] font-mono font-black text-slate-700 bg-slate-950 px-2 md:px-3 py-1 rounded-sm border border-white/5">{trade.market_type}</span>
                       <span className={`text-[8px] md:text-[9px] font-mono font-black px-2 md:px-3 py-1 rounded-sm border border-white/5 ${trade.direction === TradeDirection.LONG ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {trade.direction || 'LONG'}
                       </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 md:gap-6 mt-2 md:mt-3">
                     <TradeStat label="Entry" value={trade.entry_price.toString()} icon={<Target size={12} />} />
                     <TradeStat label="Risk" value={`${trade.risk_percent || 0}%`} icon={<AlertTriangle size={12} />} color="text-amber-500" />
                     <TradeStat label="R:R" value={trade.rr_ratio?.toString() || '0'} icon={<Activity size={12} />} color="text-blue-500" />
                  </div>
                </div>
             </div>

             <div className="flex items-center justify-between lg:justify-end gap-6 md:gap-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                <div className="text-left lg:text-right">
                   <span className="text-[8px] md:text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest block mb-1">{t('leverage_vol')}</span>
                   <span className="text-base md:text-lg font-mono font-black text-white">{trade.leverage || '1'}x // {trade.lot_size || '0'}</span>
                </div>
                <div className="hidden md:block w-px h-10 bg-white/5" />
                <div className={`flex-1 md:flex-none md:w-32 py-2 md:py-3 rounded-xl border flex items-center justify-center text-[8px] md:text-[10px] font-mono font-black uppercase tracking-[0.2em] shadow-lg ${getStatusColor(trade.status)}`}>
                   {trade.status}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTrade(trade.id); }} 
                  className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-500 transition-all opacity-100 lg:opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
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
        {selectedTrade && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/[0.05] w-full max-w-5xl rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
              <button 
                onClick={() => setSelectedTrade(null)} 
                className="absolute top-8 right-8 rtl:right-auto rtl:left-8 w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col lg:flex-row gap-12">
                 {/* Left Column: Core Info */}
                 <div className="lg:w-1/2 space-y-10">
                    <div>
                       <div className="flex items-center gap-4 mb-4">
                          <span className={`px-4 py-1.5 rounded-lg text-[10px] font-mono font-black border uppercase tracking-widest ${getStatusColor(selectedTrade.status)}`}>
                             {selectedTrade.status}
                          </span>
                          <span className={`px-4 py-1.5 rounded-lg text-[10px] font-mono font-black border uppercase tracking-widest ${selectedTrade.direction === TradeDirection.LONG ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-500 border-rose-500/20 bg-rose-500/5'}`}>
                             {selectedTrade.direction}
                          </span>
                       </div>
                       <h2 className="text-6xl font-display font-black text-white tracking-tighter uppercase mb-2">{selectedTrade.symbol}</h2>
                       <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">{selectedTrade.market_type} // {new Date(selectedTrade.entry_date).toLocaleDateString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 p-8 bg-slate-950 rounded-[2rem] border border-white/[0.03]">
                       <TradeStat label="Entry" value={selectedTrade.entry_price.toString()} icon={<Target size={16} />} />
                       {isEditing ? (
                         <div className="space-y-2">
                           <label className="text-[8px] font-mono font-black text-slate-700 uppercase">{t('exit_price_label')}</label>
                           <input 
                             type="number"
                             value={editTrade.exit_price || ''}
                             onChange={e => setEditTrade({...editTrade, exit_price: parseFloat(e.target.value)})}
                             className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-brand-primary"
                           />
                         </div>
                       ) : (
                         <TradeStat label="Exit" value={selectedTrade.exit_price?.toString() || '---'} icon={<History size={16} />} color="text-brand-secondary" />
                       )}
                       <TradeStat label="Risk %" value={`${selectedTrade.risk_percent}%`} icon={<AlertTriangle size={16} />} color="text-amber-500" />
                       {isEditing ? (
                         <div className="space-y-2">
                           <label className="text-[8px] font-mono font-black text-slate-700 uppercase">{t('rr_ratio_label')}</label>
                           <input 
                             type="number"
                             value={editTrade.rr_ratio || ''}
                             onChange={e => setEditTrade({...editTrade, rr_ratio: parseFloat(e.target.value)})}
                             className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-brand-primary"
                           />
                         </div>
                       ) : (
                         <TradeStat label="Reward (R)" value={selectedTrade.rr_ratio?.toString() || '---'} icon={<Zap size={16} />} color="text-brand-primary" />
                       )}
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-xs font-mono font-black text-slate-500 uppercase tracking-widest">{t('psychology_matrix')}</h4>
                       <div className="flex flex-wrap gap-4">
                          <PsychScore label={t('confidence_label')} value={selectedTrade.confidence_level || 0} max={10} color="bg-blue-500" />
                          <div className="bg-slate-950 border border-white/[0.03] px-6 py-4 rounded-2xl flex flex-col items-center gap-1 min-w-[120px]">
                             <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest">{t('emotion_before_label')}</span>
                             <span className="text-sm font-mono font-black text-white uppercase">{t(selectedTrade.emotion_before || 'neutral_mood')}</span>
                          </div>
                          {isEditing && (
                             <div className="bg-slate-950 border border-white/[0.03] px-6 py-4 rounded-2xl flex flex-col items-center gap-2">
                                <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest">{t('status')}</span>
                                <select 
                                  value={editTrade.status}
                                  onChange={e => setEditTrade({...editTrade, status: e.target.value as TradeStatus})}
                                  className="bg-slate-900 text-white text-[10px] font-mono border-none outline-none"
                                >
                                  {Object.values(TradeStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Narrative & Lessons */}
                 <div className="lg:w-1/2 space-y-10 border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-12">
                     <div className="space-y-4">
                        <label className="text-xs font-mono font-black text-slate-500 uppercase tracking-widest">{t('thesis_label')}</label>
                        {isEditing ? (
                          <textarea 
                            value={editTrade.trade_thesis || ''}
                            onChange={e => setEditTrade({...editTrade, trade_thesis: e.target.value})}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-slate-300 text-sm outline-none focus:border-brand-primary h-24"
                          />
                        ) : (
                          <div className="bg-slate-950 p-6 rounded-2xl border border-white/[0.03] text-slate-400 text-sm leading-relaxed italic">
                             {selectedTrade.trade_thesis || 'No strategy documented...'}
                          </div>
                        )}
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {isEditing ? (
                          <>
                             <EditLesson label={t('well_done_label')} value={editTrade.what_went_well || ''} onChange={v => setEditTrade({...editTrade, what_went_well: v})} color="text-emerald-500" />
                             <EditLesson label={t('wrong_done_label')} value={editTrade.what_went_wrong || ''} onChange={v => setEditTrade({...editTrade, what_went_wrong: v})} color="text-rose-500" />
                             <EditLesson label={t('lesson_label')} value={editTrade.lesson_learned || ''} onChange={v => setEditTrade({...editTrade, lesson_learned: v})} color="text-brand-primary" />
                          </>
                        ) : (
                          <>
                            <LessonBlock label={t('well_done_label')} content={selectedTrade.what_went_well || '---'} color="text-emerald-500" />
                            <LessonBlock label={t('wrong_done_label')} content={selectedTrade.what_went_wrong || '---'} color="text-rose-500" />
                            <LessonBlock label={t('lesson_label')} content={selectedTrade.lesson_learned || '---'} color="text-brand-primary" />
                          </>
                        )}
                     </div>
                 </div>
              </div>

              <div className="mt-16 flex gap-4">
                 <button 
                   onClick={() => setSelectedTrade(null)}
                   className="flex-1 bg-slate-800 py-6 rounded-2xl font-mono font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all"
                 >
                   {t('exit_log')}
                 </button>
                 {isEditing ? (
                   <button 
                     onClick={async () => {
                       await updateTrade(selectedTrade.id, editTrade);
                       setSelectedTrade({...selectedTrade, ...editTrade} as Trade);
                       setIsEditing(false);
                     }}
                     className="flex-[2] bg-emerald-500 text-slate-950 py-6 rounded-2xl font-mono font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                   >
                     {t('commit_data')}
                   </button>
                 ) : (
                   <button 
                     onClick={() => setIsEditing(true)}
                     className="flex-[2] bg-brand-primary text-slate-950 py-6 rounded-2xl font-mono font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
                   >
                     {t('modify_log')}
                   </button>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}

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
              className="bg-slate-900 border border-white/[0.05] w-full max-w-4xl rounded-2xl md:rounded-[3rem] p-6 md:p-16 shadow-2xl relative overflow-y-auto max-h-[90vh] scrollbar-hide"
            >
              <button 
                onClick={() => setShowAdd(false)} 
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 md:top-12 md:right-12 md:rtl:right-auto md:rtl:left-12 w-10 h-10 md:w-14 md:h-14 bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl z-20"
              >
                <X size={20} md:size={24} />
              </button>

              <div className="mb-8 md:mb-12">
                 <span className="text-[8px] md:text-[10px] font-mono font-black text-brand-secondary uppercase tracking-[0.4em] mb-2 md:mb-4 block">{t('market_deployment_init')}</span>
                 <h3 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter">{t('deploy_op')}.</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-16">
                <div className="space-y-6 md:space-y-10">
                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('operating_domain')}</label>
                      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl md:rounded-2xl border border-white/[0.03]">
                        {Object.values(MarketType).map(m => (
                          <button 
                            key={m}
                            onClick={() => setNewTrade({...newTrade, market_type: m})}
                            className={`py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-mono font-black uppercase tracking-widest transition-all ${newTrade.market_type === m ? 'bg-brand-secondary text-slate-950 shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            {t(m.toLowerCase())}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('execution_status')}</label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 bg-slate-950 rounded-xl md:rounded-2xl border border-white/[0.03]">
                        {Object.values(TradeStatus).map(s => (
                          <button 
                            key={s}
                            onClick={() => setNewTrade({...newTrade, status: s})}
                            className={`py-2.5 rounded-lg text-[7px] md:text-[8px] font-mono font-black uppercase tracking-widest transition-all ${newTrade.status === s ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            {t(s.toLowerCase())}
                          </button>
                        ))}
                      </div>
                   </div>

                   <InputField label={t('asset_symbol')} value={newTrade.symbol!} placeholder="e.g. BTC_USDT" onChange={v => setNewTrade({...newTrade, symbol: v.toUpperCase()})} />
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('direction')}</label>
                        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-xl border border-white/[0.03]">
                          {Object.values(TradeDirection).map(d => (
                            <button 
                              key={d}
                              onClick={() => setNewTrade({...newTrade, direction: d})}
                              className={`py-3 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest transition-all ${newTrade.direction === d ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                              {t(d.toLowerCase())}
                            </button>
                          ))}
                        </div>
                      </div>
                      <InputField label={t('risk_percent_label')} value={newTrade.risk_percent?.toString() || ''} type="number" placeholder="1%" onChange={v => setNewTrade({...newTrade, risk_percent: parseFloat(v)})} />
                   </div>

                   <InputField label={t('execution_entry')} value={newTrade.entry_price?.toString() || ''} type="number" placeholder="0.00" onChange={v => setNewTrade({...newTrade, entry_price: parseFloat(v)})} />
                </div>

                <div className="space-y-6 md:space-y-8">
                   <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <InputField label={t('stop_loss')} value={newTrade.stop_loss?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, stop_loss: parseFloat(v)})} color="focus:border-rose-500/30" />
                      <InputField label={t('take_profit')} value={newTrade.target_price?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, target_price: parseFloat(v)})} color="focus:border-emerald-500/30" />
                   </div>

                   <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <InputField label={newTrade.market_type === MarketType.CRYPTO ? t('leverage') : t('lot')} value={(newTrade.market_type === MarketType.CRYPTO ? newTrade.leverage : newTrade.lot_size)?.toString() || ''} type="number" onChange={v => setNewTrade({...newTrade, [newTrade.market_type === MarketType.CRYPTO ? 'leverage' : 'lot_size']: parseFloat(v)})} />
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('emotion_before_label')}</label>
                        <div className="flex gap-2 p-1.5 bg-slate-950 rounded-xl border border-white/[0.03] overflow-x-auto scrollbar-hide">
                          {EMOTIONS.map(e => (
                            <button 
                              key={e}
                              onClick={() => setNewTrade({...newTrade, emotion_before: e})}
                              className={`px-3 py-2 shrink-0 rounded-lg text-[8px] font-mono font-black uppercase tracking-widest transition-all ${newTrade.emotion_before === e ? 'bg-brand-primary text-slate-950' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                              {t(e)}
                            </button>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('thesis_label')}</label>
                      <textarea 
                        value={newTrade.trade_thesis}
                        onChange={e => setNewTrade({...newTrade, trade_thesis: e.target.value})}
                        placeholder="Context / Signal / Strategy..."
                        className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-4 md:p-6 text-slate-300 text-xs md:text-sm font-medium h-24 md:h-28 focus:border-brand-secondary/30 outline-none resize-none"
                      />
                   </div>
                   
                   <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-4">{t('reason')}</label>
                      <textarea 
                        value={newTrade.reflection_reason}
                        onChange={e => setNewTrade({...newTrade, reflection_reason: e.target.value})}
                        placeholder={t('reason_placeholder') || "Define outcome causality..."}
                        className="w-full bg-slate-950 border border-white/[0.03] rounded-2xl p-4 md:p-6 text-slate-300 text-xs md:text-sm font-medium h-24 md:h-28 focus:border-brand-secondary/30 outline-none resize-none"
                      />
                   </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <button 
                  onClick={handleAdd}
                  disabled={!newTrade.symbol || !newTrade.entry_price}
                  className="w-full md:flex-[2] bg-brand-secondary hover:bg-blue-400 disabled:opacity-30 text-slate-950 font-mono font-black uppercase tracking-[0.2em] py-5 md:py-8 rounded-xl md:rounded-[2rem] transition-all shadow-2xl shadow-brand-secondary/20 active:scale-95"
                >
                  {t('commit_data')}
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="w-full md:flex-1 bg-slate-800 py-5 md:py-8 rounded-xl md:rounded-[2rem] font-mono font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
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

function PsychScore({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  return (
    <div className="bg-slate-950 border border-white/[0.03] px-6 py-4 rounded-2xl flex flex-col items-center gap-3">
       <span className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest">{label}</span>
       <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
             <div key={i} className={`w-2 h-4 rounded-sm ${i < value ? color : 'bg-slate-900 border border-white/5'}`} />
          ))}
       </div>
       <span className="text-xl font-mono font-black text-white">{value}<span className="text-[10px] text-slate-700">/{max}</span></span>
    </div>
  );
}

function LessonBlock({ label, content, color }: { label: string, content: string, color: string }) {
  return (
    <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/[0.03] group hover:bg-slate-900 transition-colors">
       <div className="flex items-center gap-3 mb-2">
          <div className={`w-1 h-3 rounded-full ${color.replace('text-', 'bg-')}`} />
          <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${color}`}>{label}</span>
       </div>
       <p className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{content}</p>
    </div>
  );
}

function EditLesson({ label, value, onChange, color }: { label: string, value: string, onChange: (v: string) => void, color: string }) {
  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
       <div className="flex items-center gap-3 mb-2">
          <div className={`w-1 h-3 rounded-full ${color.replace('text-', 'bg-')}`} />
          <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${color}`}>{label}</span>
       </div>
       <textarea 
         value={value}
         onChange={e => onChange(e.target.value)}
         className="w-full bg-slate-900 border-none rounded-lg p-2 text-slate-300 text-xs font-medium outline-none focus:ring-1 focus:ring-brand-primary"
       />
    </div>
  );
}

function InputField({ label, value, placeholder, onChange, type = "text", color = "focus:border-brand-secondary/30" }: { label: string, value: string, placeholder?: string, onChange: (v: string) => void, type?: string, color?: string }) {
  return (
    <div className="space-y-3 md:space-y-4">
      <label className="text-[9px] md:text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest ml-1 md:ml-4">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-950 border border-white/[0.03] rounded-xl md:rounded-2xl p-4 md:p-6 text-white text-lg md:text-xl font-black outline-none transition-all placeholder:text-slate-850 ${color}`}
      />
    </div>
  );
}
