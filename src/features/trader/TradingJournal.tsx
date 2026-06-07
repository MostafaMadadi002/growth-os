import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, X, MessageSquare 
} from 'lucide-react';
import { useAppStore, Trade } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';

export default function TradingJournal() {
  const { t, language } = useI18n();
  const { traderData, addTrade, deleteTrade } = useAppStore();
  const [showAddRow, setShowAddRow] = useState(false);
  const [selectedTradeNotes, setSelectedTradeNotes] = useState<Trade | null>(null);

  const trades = traderData.trades || [];

  const [newTradeData, setNewTradeData] = useState({
    entry: '',
    sl: '',
    tp: '',
    rr: '0'
  });

  const calculateRR = (entry: number, sl: number, tp: number, pos: string) => {
    if (!entry || !sl || !tp) return '0';
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    if (risk === 0) return '0';
    return (reward / risk).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTradeData(prev => {
      const updated = { ...prev, [name]: value };
      if (['entry', 'sl', 'tp'].includes(name)) {
        const entry = Number(name === 'entry' ? value : updated.entry);
        const sl = Number(name === 'sl' ? value : updated.sl);
        const tp = Number(name === 'tp' ? value : updated.tp);
        const formData = new FormData(e.target.form!);
        const pos = formData.get('positionType') as string;
        updated.rr = calculateRR(entry, sl, tp, pos);
      }
      return updated;
    });
  };

  const [showNoteInput, setShowNoteInput] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [tempFee, setTempFee] = useState('');

  const handleAddTrade = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTrade: Trade = {
      id: Math.random().toString(36).substring(2, 9),
      marketType: formData.get('marketType') as 'FOREX' | 'CRYPTO',
      symbol: (formData.get('symbol') as string).toUpperCase(),
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      positionType: formData.get('positionType') as 'BUY' | 'SELL',
      size: Number(formData.get('size')),
      riskReward: Number(newTradeData.rr),
      fee: Number(tempFee || 0),
      entry: Number(newTradeData.entry),
      stopLoss: Number(newTradeData.sl),
      target: Number(newTradeData.tp),
      result: formData.get('result') as any,
      profitAmount: Number(formData.get('profitAmount') || 0),
      notes: tempNotes,
    };

    addTrade(newTrade);
    setShowAddRow(false);
    setNewTradeData({ entry: '', sl: '', tp: '', rr: '0' });
    setTempNotes('');
    setTempFee('');
    setShowNoteInput(false);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'text-emerald-400';
      case 'LOSS': return 'text-rose-400';
      case 'BE': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case 'WIN': return t('win_label') || t('win');
      case 'LOSS': return t('loss_label') || t('loss');
      case 'BE': return t('be');
      case 'PENDING': return t('pending');
      default: return result;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-display font-black text-white tracking-tighter uppercase leading-none">
            {t('trading_journal')}
          </h2>
          <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mt-2">
            STABLE_TRADING_NODE // {trades.length} SESSIONS_RECORDED
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddRow(!showAddRow)}
          className={`${showAddRow ? 'bg-rose-500/10 text-rose-400' : 'bg-brand-primary text-slate-950'} px-6 py-3 rounded-2xl font-display font-black uppercase text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/20`}
        >
          {showAddRow ? <X size={16} /> : <Plus size={16} />}
          {showAddRow ? t('cancel') || 'CANCEL' : t('add_trade')}
        </motion.button>
      </header>

      {/* Table-like View */}
      <form onSubmit={handleAddTrade}>
        {/* Mobile Add Form */}
        <div className="md:hidden">
          <AnimatePresence>
            {showAddRow && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900 border border-brand-primary/20 rounded-[2.5rem] p-6 mb-6 space-y-4 shadow-xl"
                dir={language === 'fa' ? 'rtl' : 'ltr'}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('market_type')}</label>
                    <select name="marketType" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none">
                      <option value="FOREX">{t('forex')}</option>
                      <option value="CRYPTO">{t('crypto')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('symbol')}</label>
                    <input name="symbol" required placeholder="BTCUSDT" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none uppercase" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('position')}</label>
                    <select name="positionType" onChange={handleInputChange} className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none">
                      <option value="BUY">{t('buy')}</option>
                      <option value="SELL">{t('sell')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('date')}</label>
                    <input name="date" type="date" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('entry')}</label>
                    <input name="entry" type="number" step="any" required value={newTradeData.entry} onChange={handleInputChange} placeholder="0.0" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest text-rose-400">{t('sl')}</label>
                    <input name="sl" type="number" step="any" required value={newTradeData.sl} onChange={handleInputChange} placeholder="SL" className="w-full bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-rose-400 font-mono text-[11px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest text-emerald-400">{t('tp')}</label>
                    <input name="tp" type="number" step="any" required value={newTradeData.tp} onChange={handleInputChange} placeholder="TP" className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-emerald-400 font-mono text-[11px] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('lot')} / {t('margin')}</label>
                    <input name="size" type="number" step="any" required placeholder="Size" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('fee')}</label>
                    <input name="fee" value={tempFee} onChange={(e) => setTempFee(e.target.value)} type="number" step="any" placeholder="Spread" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('result')}</label>
                    <select name="result" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none">
                      <option value="WIN">{t('win_label') || t('win')}</option>
                      <option value="LOSS">{t('loss_label') || t('loss')}</option>
                      <option value="BE">{t('be')}</option>
                      <option value="PENDING">{t('pending')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('profit_loss')}</label>
                    <input name="profitAmount" type="number" step="any" placeholder="0.00" className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[11px] outline-none" />
                  </div>
                </div>

                <textarea 
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder={t('trade_notes')}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-white font-mono text-[11px] min-h-[80px] outline-none"
                />

                <div className="pt-2">
                  <button type="submit" className="w-full bg-brand-primary text-slate-950 py-4 rounded-2xl font-display font-black uppercase text-xs shadow-lg shadow-brand-primary/20">
                    {t('add_trade')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop View Table */}
        <div className="bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]" dir={language === 'fa' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-white/5 text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-4 py-4">{t('date')}</th>
                  <th className="px-4 py-4">{t('symbol')}</th>
                  <th className="px-4 py-4">{t('market_type')}</th>
                  <th className="px-4 py-4">{t('position')}</th>
                  <th className="px-4 py-4">{t('entry')}</th>
                  <th className="px-4 py-4">{t('sl')} / {t('tp')}</th>
                  <th className="px-4 py-4">{t('lot')} / {t('margin')}</th>
                  <th className="px-4 py-4">{t('fee')}</th>
                  <th className="px-4 py-4">{t('rr')}</th>
                  <th className="px-4 py-4">{t('result')}</th>
                  <th className="px-4 py-4">{t('profit_loss')}</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                <AnimatePresence>
                  {showAddRow && (
                    <motion.tr 
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      className="bg-brand-primary/[0.07] border-b border-brand-primary/20 origin-top"
                    >
                      <td className="p-1 px-2">
                        <input name="date" type="date" required className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center" defaultValue={new Date().toISOString().split('T')[0]} />
                      </td>
                      <td className="p-1 px-2">
                        <input name="symbol" required placeholder="BTCUSDT" className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 uppercase font-black" />
                      </td>
                      <td className="p-1 px-2">
                        <select name="marketType" className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 appearance-none text-center">
                          <option value="FOREX">FX</option>
                          <option value="CRYPTO">CR</option>
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <select name="positionType" onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 appearance-none text-center font-black">
                          <option value="BUY" className="text-emerald-400">BUY</option>
                          <option value="SELL" className="text-rose-400">SELL</option>
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <input name="entry" type="number" step="any" required value={newTradeData.entry} onChange={handleInputChange} placeholder="0.00" className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 font-bold" />
                      </td>
                      <td className="p-1 px-2">
                        <div className="flex gap-1">
                          <input name="sl" type="number" step="any" required value={newTradeData.sl} onChange={handleInputChange} placeholder="SL" className="w-1/2 bg-rose-500/5 border border-rose-500/10 rounded-lg p-2 text-rose-400 font-mono text-[10px] outline-none focus:border-rose-500/40 text-center" />
                          <input name="tp" type="number" step="any" required value={newTradeData.tp} onChange={handleInputChange} placeholder="TP" className="w-1/2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 text-emerald-400 font-mono text-[10px] outline-none focus:border-emerald-500/40 text-center" />
                        </div>
                      </td>
                      <td className="p-1 px-2">
                        <input name="size" type="number" step="any" required placeholder="0.10" className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-slate-300 font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center" />
                      </td>
                      <td className="p-1 px-2">
                         <input value={tempFee} onChange={(e) => setTempFee(e.target.value)} type="number" step="any" placeholder="0.0" className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-slate-400 font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center" />
                      </td>
                      <td className="p-1 px-2">
                        <div className="w-full bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-2 text-brand-primary font-mono text-[10px] text-center font-black">
                          1:{newTradeData.rr}
                        </div>
                      </td>
                      <td className="p-1 px-2">
                        <select name="result" className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 appearance-none text-center">
                          <option value="PENDING">{t('pending')}</option>
                          <option value="WIN">{t('win_label') || t('win')}</option>
                          <option value="LOSS">{t('loss_label') || t('loss')}</option>
                          <option value="BE">{t('be')}</option>
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <input name="profitAmount" type="number" step="any" placeholder="0.00" className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-white font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center font-bold" />
                      </td>
                      <td className="p-1 px-2">
                        <div className="flex items-center justify-center gap-1">
                           <button 
                             type="button" 
                             onClick={() => setShowNoteInput(!showNoteInput)}
                             className={`p-2 rounded-lg transition-colors ${tempNotes ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-slate-500'}`}
                           >
                             <MessageSquare size={14} />
                           </button>
                           {showNoteInput && (
                             <div className="absolute top-full right-0 mt-2 w-64 z-[60] bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl">
                               <textarea 
                                 value={tempNotes}
                                 onChange={(e) => setTempNotes(e.target.value)}
                                 className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-white font-mono text-[10px] min-h-[100px] outline-none"
                                 placeholder={t('trade_notes')}
                                 autoFocus
                               />
                             </div>
                           )}
                           <button type="submit" className="p-2.5 bg-brand-primary text-slate-950 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
                             <Plus size={14} className="stroke-[3]" />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-20 text-center text-slate-600 uppercase font-black tracking-widest opacity-50">
                      NO_TRADES_IN_DATABASE
                    </td>
                  </tr>
                ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4 text-slate-400 whitespace-nowrap">{trade.date}</td>
                    <td className="px-4 py-4 font-black text-white">{trade.symbol}</td>
                    <td className="px-4 py-4 text-slate-500">{t(trade.marketType.toLowerCase())}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                        trade.positionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {t(trade.positionType === 'BUY' ? 'buy' : 'sell')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{trade.entry}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                       <span className="text-rose-400/60">{trade.stopLoss}</span>
                       <span className="mx-2 text-slate-600">/</span>
                       <span className="text-emerald-400/60">{trade.target}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{trade.size}</td>
                    <td className="px-4 py-4 text-slate-500">{trade.fee || 0}</td>
                    <td className="px-4 py-4 text-slate-400">1:{trade.riskReward}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-black ${getResultColor(trade.result)}`}>
                        {getResultLabel(trade.result)}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-center font-black ${trade.profitAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.profitAmount === 0 ? '-' : trade.profitAmount}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {trade.notes && (
                          <button 
                            onClick={(e) => { e.preventDefault(); setSelectedTradeNotes(trade); }}
                            className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
                          >
                            <MessageSquare size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.preventDefault(); deleteTrade(trade.id); }}
                          className="p-2 bg-rose-500/10 rounded-xl text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {trades.length === 0 && !showAddRow && (
          <div className="py-20 text-center text-slate-600 uppercase font-black tracking-widest opacity-50">
            NO_TRADES_IN_DATABASE
          </div>
        )}
        {trades.map((trade) => (
          <motion.div 
            key={trade.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 space-y-4 relative group"
            dir={language === 'fa' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-display font-black text-white">{trade.symbol}</h4>
                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{trade.date} // {t(trade.marketType.toLowerCase())}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl font-display font-black text-[10px] uppercase shadow-lg ${
                  trade.positionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5' : 'bg-rose-500/10 text-rose-400 shadow-rose-500/5'
                }`}>
                  {t(trade.positionType === 'BUY' ? 'buy' : 'sell')}
                </span>
                <button onClick={() => deleteTrade(trade.id)} className="p-2 text-rose-500/40 hover:text-rose-500">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">{t('entry')}</p>
                <p className="text-sm font-display font-black text-white">{trade.entry}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">{t('profit_loss')}</p>
                <p className={`text-sm font-display font-black ${trade.profitAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trade.profitAmount > 0 ? '+' : ''}{trade.profitAmount} USD
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest px-1">
              <div className="flex gap-3">
                 <span>SL: <span className="text-rose-400">{trade.stopLoss}</span></span>
                 <span>TP: <span className="text-emerald-400">{trade.target}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-black ${getResultColor(trade.result)}`}>{getResultLabel(trade.result)}</span>
                {trade.notes && (
                  <button onClick={() => setSelectedTradeNotes(trade)} className="text-brand-primary">
                    <MessageSquare size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </form>

      {/* Note View Modal */}
      <AnimatePresence>
        {selectedTradeNotes && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTradeNotes(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/5 rounded-[40px] p-8 overflow-hidden shadow-2xl"
              dir={language === 'fa' ? 'rtl' : 'ltr'}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">{t('trade_notes')}</h3>
                <button 
                  onClick={() => setSelectedTradeNotes(null)}
                  className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="bg-white/5 rounded-3xl p-6 text-slate-300 font-mono text-sm leading-relaxed min-h-[200px]">
                {selectedTradeNotes.notes}
              </div>
              <div className="mt-6 flex justify-between items-center text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                <span>{selectedTradeNotes.symbol} // {selectedTradeNotes.date}</span>
                <span className={selectedTradeNotes.profitAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {selectedTradeNotes.profitAmount} USD
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
