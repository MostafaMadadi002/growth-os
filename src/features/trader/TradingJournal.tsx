import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, X, MessageSquare, Edit3, Save, Tag, Trash2
} from 'lucide-react';
import { useAppStore, Trade } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';

export default function TradingJournal() {
  const { t, language } = useI18n();
  const { traderData, addTrade, deleteTrade, updateTrade } = useAppStore();
  const [showAddRow, setShowAddRow] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [selectedTradeNotes, setSelectedTradeNotes] = useState<Trade | null>(null);

  const trades = traderData.trades || [];
  
  // Reusable Labels System
  const DEFAULT_LABELS = [
    t('strategy_a') || 'Strategy A',
    t('strategy_b') || 'Strategy B',
    t('fomo') || 'FOMO',
    t('emotional') || 'Emotional',
    t('revenge_trade') || 'Revenge Trade',
    t('trend_follow') || 'Trend Follow',
    t('counter_trend') || 'Counter Trend',
    t('breakout') || 'Breakout'
  ];

  const allUsedLabels = Array.from(new Set([
    ...DEFAULT_LABELS,
    ...trades.flatMap(t => t.labels || [])
  ]));

  const [newTradeData, setNewTradeData] = useState({
    symbol: '',
    marketType: 'FOREX' as 'FOREX' | 'CRYPTO',
    positionType: 'BUY' as 'BUY' | 'SELL',
    date: new Date().toISOString().split('T')[0],
    entry: '',
    sl: '',
    tp: '',
    size: '',
    fee: '',
    profitAmount: '',
    result: 'PENDING' as 'WIN' | 'LOSS' | 'BE' | 'PENDING',
    rr: '0'
  });

  const [tempNotes, setTempNotes] = useState('');
  const [tempLabel, setTempLabel] = useState('');
  const [tempLabels, setTempLabels] = useState<string[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showLabelInput, setShowLabelInput] = useState(false);

  const calculateRR = (entry: number, sl: number, tp: number) => {
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
        updated.rr = calculateRR(entry, sl, tp);
      }
      return updated;
    });
  };

  const handleAddTrade = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newTradeData.symbol || !newTradeData.entry || !newTradeData.size) {
       // Optional: Add some user feedback here if needed, but per constraints we keep it simple
       return;
    }

    const newTrade: Trade = {
      id: Math.random().toString(36).substring(2, 9),
      marketType: newTradeData.marketType as 'FOREX' | 'CRYPTO',
      symbol: newTradeData.symbol.toUpperCase(),
      date: newTradeData.date,
      positionType: newTradeData.positionType as 'BUY' | 'SELL',
      size: Number(newTradeData.size),
      riskReward: Number(newTradeData.rr),
      fee: Number(newTradeData.fee || 0),
      entry: Number(newTradeData.entry),
      stopLoss: Number(newTradeData.sl || 0),
      target: Number(newTradeData.tp || 0),
      result: newTradeData.result,
      profitAmount: Number(newTradeData.profitAmount || 0),
      notes: tempNotes,
      labels: tempLabels.length > 0 ? tempLabels : [t('no_labels')],
    };

    addTrade(newTrade);
    setShowAddRow(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTradeData({
      symbol: '',
      marketType: 'FOREX',
      positionType: 'BUY',
      date: new Date().toISOString().split('T')[0],
      entry: '',
      sl: '',
      tp: '',
      size: '',
      fee: '',
      profitAmount: '',
      result: 'PENDING',
      rr: '0'
    });
    setTempNotes('');
    setTempLabel('');
    setTempLabels([]);
    setShowNoteInput(false);
    setShowLabelInput(false);
  };

  const handleUpdateTrade = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrade) return;
    const formData = new FormData(e.currentTarget);
    const symbolVal = formData.get('symbol') as string;
    
    const entry = Number(formData.get('entry'));
    const sl = Number(formData.get('sl'));
    const tp = Number(formData.get('tp'));

    const updated: Trade = {
      ...editingTrade,
      marketType: (formData.get('marketType') as 'FOREX' | 'CRYPTO') || editingTrade.marketType || 'FOREX',
      symbol: (symbolVal || '').toUpperCase(),
      date: formData.get('date') as string || editingTrade.date,
      positionType: (formData.get('positionType') as 'BUY' | 'SELL') || editingTrade.positionType,
      size: Number(formData.get('size')),
      entry,
      stopLoss: sl,
      target: tp,
      riskReward: Number(calculateRR(entry, sl, tp)),
      fee: Number(formData.get('fee')),
      result: formData.get('result') as any,
      profitAmount: Number(formData.get('profitAmount') || 0),
      notes: formData.get('notes') as string,
      labels: (formData.get('labels') as string)?.split(',').map(l => l.trim()).filter(Boolean) || editingTrade.labels,
    };

    updateTrade(updated);
    setEditingTrade(null);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'text-emerald-400';
      case 'LOSS': return 'text-rose-400';
      case 'BE': return 'text-amber-400';
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
    <div className="p-4 md:p-8 space-y-8 pb-32 max-w-7xl mx-auto px-4 md:px-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div className="space-y-1">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">{t('trading_journal')}</span>
           </div>
          <h2 className={`text-3xl md:text-5xl font-display font-black text-text-primary ${language === 'fa' ? 'tracking-normal leading-tight' : 'tracking-tighter leading-none'} uppercase`}>
            {t('trading_journal').split(' ')[0]}<span className="text-brand-primary">.</span>
          </h2>
          <p className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">
             {trades.length} SESSIONS_CAPTURED
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowAddRow(!showAddRow); if(showAddRow) resetForm(); }}
          className={`${showAddRow ? 'bg-surface-card backdrop-blur-xl border border-surface-border text-text-secondary' : 'bg-brand-primary text-slate-950'} px-8 py-4 rounded-2xl font-display font-black uppercase text-xs flex items-center gap-3 shadow-xl transition-all`}
        >
          {showAddRow ? <X size={18} /> : <Plus size={18} strokeWidth={3} />}
          {showAddRow ? t('cancel') : t('add_trade')}
        </motion.button>
      </header>

      {/* Mobile Add Form */}
      <div className="md:hidden">
        <AnimatePresence>
          {showAddRow && (
            <motion.form 
              onSubmit={handleAddTrade}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface-card backdrop-blur-xl border border-brand-primary/20 rounded-[2.5rem] p-6 mb-6 space-y-4 shadow-xl"
              dir={language === 'fa' ? 'rtl' : 'ltr'}
            >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('market_type')}</label>
                    <select 
                      name="marketType" 
                      value={newTradeData.marketType}
                      onChange={handleInputChange}
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none focus:border-brand-primary/20 cursor-pointer"
                    >
                      <option value="FOREX" className="bg-surface-card">{t('forex')}</option>
                      <option value="CRYPTO" className="bg-surface-card">{t('crypto')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('symbol')}</label>
                    <input 
                      name="symbol" 
                      required 
                      value={newTradeData.symbol}
                      onChange={handleInputChange}
                      placeholder="BTCUSDT" 
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none uppercase" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('position')}</label>
                    <select 
                      name="positionType" 
                      value={newTradeData.positionType}
                      onChange={handleInputChange} 
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none focus:border-brand-primary/20 cursor-pointer"
                    >
                      <option value="BUY" className="bg-surface-card">{t('buy')}</option>
                      <option value="SELL" className="bg-surface-card">{t('sell')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('date')}</label>
                    <input 
                      name="date" 
                      type="date" 
                      value={newTradeData.date}
                      onChange={handleInputChange}
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('entry')}</label>
                    <input name="entry" type="number" step="any" required value={newTradeData.entry} onChange={handleInputChange} placeholder="0.0" className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest text-rose-400">{t('sl')}</label>
                    <input name="sl" type="number" step="any" value={newTradeData.sl} onChange={handleInputChange} placeholder="SL" className="w-full bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-rose-400 font-mono text-[11px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest text-emerald-400">{t('tp')}</label>
                    <input name="tp" type="number" step="any" value={newTradeData.tp} onChange={handleInputChange} placeholder="TP" className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-emerald-400 font-mono text-[11px] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('lot')} / {t('margin')}</label>
                    <input 
                      name="size" 
                      type="number" 
                      step="any" 
                      required 
                      value={newTradeData.size}
                      onChange={handleInputChange}
                      placeholder="Size" 
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('fee')}</label>
                    <input 
                      name="fee" 
                      value={newTradeData.fee} 
                      onChange={handleInputChange} 
                      type="number" 
                      step="any" 
                      placeholder="Spread" 
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('result')}</label>
                    <select 
                      name="result" 
                      value={newTradeData.result}
                      onChange={handleInputChange}
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none focus:border-brand-primary/20 cursor-pointer"
                    >
                      <option value="PENDING" className="bg-surface-card">{t('pending')}</option>
                      <option value="WIN" className="bg-surface-card">{t('win_label') || t('win')}</option>
                      <option value="LOSS" className="bg-surface-card">{t('loss_label') || t('loss')}</option>
                      <option value="BE" className="bg-surface-card">{t('be')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('profit_loss')}</label>
                    <input 
                      name="profitAmount" 
                      type="number" 
                      step="any" 
                      value={newTradeData.profitAmount}
                      onChange={handleInputChange}
                      placeholder="0.00" 
                      className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('labels')}</label>
                    {tempLabels.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setTempLabels([])}
                        className="text-[8px] text-rose-500 font-black uppercase"
                      >
                        {t('clear_all')}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      value={tempLabel}
                      onChange={(e) => setTempLabel(e.target.value)}
                      placeholder={t('add_label')}
                      className="flex-1 bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[11px] outline-none focus:border-brand-primary/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (tempLabel.trim() && !tempLabels.includes(tempLabel.trim())) {
                            setTempLabels([...tempLabels, tempLabel.trim()]);
                            setTempLabel('');
                          }
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (tempLabel.trim() && !tempLabels.includes(tempLabel.trim())) {
                          setTempLabels([...tempLabels, tempLabel.trim()]);
                          setTempLabel('');
                        }
                      }}
                      className="p-3 bg-brand-primary text-slate-950 rounded-xl"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {/* Default & Frequent Suggestions Mobile */}
                  <div className="space-y-2 py-1">
                    <p className="text-[8px] font-mono font-black text-text-secondary opacity-60 uppercase tracking-widest">{t('select_labels') || 'SELECT LABELS'}</p>
                    <div className="flex flex-wrap gap-2">
                      {allUsedLabels
                        .map(label => {
                          const isSelected = tempLabels.includes(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setTempLabels(tempLabels.filter(l => l !== label));
                                } else {
                                  setTempLabels([...tempLabels, label]);
                                }
                              }}
                              className={`px-3 py-1.5 border rounded-xl text-[10px] font-mono transition-all ${
                                isSelected 
                                ? 'bg-brand-primary text-slate-950 border-brand-primary' 
                                : 'bg-surface-base border-surface-border text-text-secondary hover:border-brand-primary/40'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}{label}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <textarea 
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder={t('trade_notes')}
                  className="w-full bg-surface-base border border-surface-border rounded-xl p-4 text-text-primary font-mono text-[11px] min-h-[80px] outline-none"
                />

                <div className="pt-2">
                  <button type="submit" className="w-full bg-brand-primary text-slate-950 py-3 md:py-4 rounded-xl md:rounded-2xl font-display font-black uppercase text-[11px] md:text-xs shadow-lg shadow-brand-primary/20">
                    {t('add_trade')}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-surface-card backdrop-blur-xl rounded-3xl border border-surface-border overflow-hidden hidden md:block shadow-sm">
          <form onSubmit={handleAddTrade} className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]" dir={language === 'fa' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-surface-base text-text-secondary uppercase tracking-[0.1em] border-b border-surface-border font-black">
                  <th className="px-6 py-5">{t('date')}</th>
                  <th className="px-6 py-5">{t('symbol')}</th>
                  <th className="px-6 py-5">{t('market_type')}</th>
                  <th className="px-6 py-5">{t('position')}</th>
                  <th className="px-6 py-5">{t('entry')}</th>
                  <th className="px-6 py-5">{t('sl')} / {t('tp')}</th>
                  <th className="px-6 py-5">{t('lot')}</th>
                  <th className="px-6 py-5">{t('rr')}</th>
                  <th className="px-6 py-5">{t('result')}</th>
                  <th className="px-6 py-5">{t('profit_loss')}</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                <AnimatePresence>
                  {showAddRow && (
                    <motion.tr 
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      className="bg-brand-primary/[0.07] border-b border-brand-primary/20 origin-top"
                    >
                      <td className="p-1 px-2">
                        <input 
                          name="date" 
                          type="date" 
                          required 
                          value={newTradeData.date}
                          onChange={handleInputChange}
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center" 
                        />
                      </td>
                      <td className="p-1 px-2">
                        <input 
                          name="symbol" 
                          required 
                          placeholder="BTCUSDT" 
                          value={newTradeData.symbol}
                          onChange={handleInputChange}
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 uppercase font-black" 
                        />
                      </td>
                      <td className="p-1 px-2">
                        <select 
                          name="marketType" 
                          value={newTradeData.marketType}
                          onChange={handleInputChange}
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 cursor-pointer"
                        >
                          <option value="FOREX">FX</option>
                          <option value="CRYPTO">CR</option>
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <select 
                          name="positionType" 
                          value={newTradeData.positionType}
                          onChange={handleInputChange}
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 cursor-pointer font-black"
                        >
                          <option value="BUY" className="text-emerald-400">BUY</option>
                          <option value="SELL" className="text-rose-400">SELL</option>
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <input name="entry" type="number" step="any" required value={newTradeData.entry} onChange={handleInputChange} placeholder="0.00" className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 font-bold" />
                      </td>
                      <td className="p-1 px-2">
                        <div className="flex gap-1">
                          <input name="sl" type="number" step="any" value={newTradeData.sl} onChange={handleInputChange} placeholder="SL" className="w-1/2 bg-rose-500/5 border border-rose-500/10 rounded-lg p-2 text-rose-400 font-mono text-[10px] outline-none focus:border-rose-500/40 text-center" />
                          <input name="tp" type="number" step="any" value={newTradeData.tp} onChange={handleInputChange} placeholder="TP" className="w-1/2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 text-emerald-400 font-mono text-[10px] outline-none focus:border-emerald-500/40 text-center" />
                        </div>
                      </td>
                      <td className="p-1 px-2">
                        <input 
                          name="size" 
                          type="number" 
                          step="any" 
                          required 
                          value={newTradeData.size}
                          onChange={handleInputChange}
                          placeholder="0.10" 
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-secondary font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center" 
                        />
                      </td>
                      <td className="p-1 px-2">
                         <input 
                          name="fee"
                          value={newTradeData.fee} 
                          onChange={handleInputChange} 
                          type="number" 
                          step="any" 
                          placeholder="0.0" 
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-secondary font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center" 
                         />
                      </td>
                      <td className="p-1 px-2">
                        <div className="w-full bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-2 text-brand-primary font-mono text-[10px] text-center font-black">
                          1:{newTradeData.rr}
                        </div>
                      </td>
                      <td className="p-1 px-2">
                        <select 
                          name="result" 
                          value={newTradeData.result}
                          onChange={handleInputChange}
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 cursor-pointer"
                        >
                          <option value="PENDING">{t('pending')}</option>
                          <option value="WIN">{t('win_label') || t('win')}</option>
                          <option value="LOSS">{t('loss_label') || t('loss')}</option>
                          <option value="BE">{t('be')}</option>
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <input 
                          name="profitAmount" 
                          type="number" 
                          step="any" 
                          value={newTradeData.profitAmount}
                          onChange={handleInputChange}
                          placeholder="0.00" 
                          className="w-full bg-surface-base border border-surface-border rounded-lg p-2 text-text-primary font-mono text-[10px] outline-none focus:border-brand-primary/40 text-center font-bold" 
                        />
                      </td>
                      <td className="p-1 px-2">
                        <div className="flex items-center justify-center gap-1">
                           <button 
                             type="button" 
                             onClick={() => setShowNoteInput(!showNoteInput)}
                             className={`p-2 rounded-lg transition-colors ${tempNotes ? 'bg-brand-primary/20 text-brand-primary' : 'bg-surface-base text-text-secondary'}`}
                           >
                             <MessageSquare size={14} />
                           </button>
                           <div className="relative">
                             <button 
                               type="button" 
                               onClick={() => setShowLabelInput(!showLabelInput)}
                               className={`p-2 rounded-lg transition-colors ${tempLabels.length > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-surface-base text-text-secondary'}`}
                             >
                               <Tag size={14} />
                             </button>
                             {showLabelInput && (
                               <div className="absolute top-full right-0 mt-2 w-64 z-[70] bg-surface-card border border-surface-border rounded-2xl p-4 shadow-2xl">
                                  <div className="flex gap-2 mb-3">
                                    <input 
                                      value={tempLabel}
                                      onChange={(e) => setTempLabel(e.target.value)}
                                      placeholder="New Label..."
                                      className="flex-1 bg-surface-base border border-surface-border rounded-xl p-2 text-text-primary font-mono text-[10px] outline-none"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          if (tempLabel.trim() && !tempLabels.includes(tempLabel.trim())) {
                                            setTempLabels([...tempLabels, tempLabel.trim()]);
                                            setTempLabel('');
                                          }
                                        }
                                      }}
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        if (tempLabel.trim() && !tempLabels.includes(tempLabel.trim())) {
                                          setTempLabels([...tempLabels, tempLabel.trim()]);
                                          setTempLabel('');
                                        }
                                      }}
                                      className="p-2 bg-brand-primary text-slate-950 rounded-lg"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>

                                  {/* Multi-Select Suggestions Desktop Inline */}
                                  <div className="space-y-2 pb-3 mb-3 shrink-0">
                                    <p className="text-[7px] font-mono font-black text-text-secondary tracking-widest uppercase">{t('quick_select') || 'QUICK SELECT'}</p>
                                    <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto scrollbar-hide">
                                      {allUsedLabels
                                        .map(label => {
                                          const isSelected = tempLabels.includes(label);
                                          return (
                                            <button
                                              key={label}
                                              type="button"
                                              onClick={() => {
                                                if (isSelected) {
                                                  setTempLabels(tempLabels.filter(l => l !== label));
                                                } else {
                                                  setTempLabels([...tempLabels, label]);
                                                }
                                              }}
                                              className={`px-2 py-1 border rounded text-[8px] font-mono transition-all ${
                                                isSelected
                                                ? 'bg-brand-primary text-slate-950 border-brand-primary'
                                                : 'bg-surface-base border-surface-border text-text-secondary hover:text-text-primary'
                                              }`}
                                            >
                                              {label}
                                            </button>
                                          );
                                        })}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {tempLabels.map(label => (
                                      <span key={label} className="px-2 py-1 bg-surface-base border border-surface-border rounded-lg text-[8px] font-mono font-black text-text-secondary flex items-center gap-1">
                                        #{label}
                                        <button onClick={() => setTempLabels(tempLabels.filter(l => l !== label))} className="text-rose-500">
                                          <X size={10} />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                               </div>
                             )}
                           </div>
                           {showNoteInput && (
                             <div className="absolute top-full right-0 mt-2 w-64 z-[60] bg-surface-card border border-surface-border rounded-2xl p-4 shadow-2xl">
                               <textarea 
                                 value={tempNotes}
                                 onChange={(e) => setTempNotes(e.target.value)}
                                 className="w-full bg-surface-base border border-surface-border rounded-xl p-3 text-text-primary font-mono text-[10px] min-h-[100px] outline-none"
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
                    <td colSpan={12} className="py-20 text-center text-text-secondary uppercase font-black tracking-widest opacity-50">
                      NO_TRADES_IN_DATABASE
                    </td>
                  </tr>
                ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-surface-base transition-colors group">
                    <td className="px-4 py-4 text-text-secondary whitespace-nowrap">{trade.date}</td>
                    <td className="px-4 py-4 font-black text-text-primary">{trade.symbol}</td>
                    <td className="px-4 py-4 text-text-secondary opacity-60">{trade.marketType ? t(trade.marketType.toLowerCase()) : t('forex')}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                        trade.positionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {t(trade.positionType === 'BUY' ? 'buy' : 'sell')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{trade.entry}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                       <span className="text-rose-400/60">{trade.stopLoss}</span>
                       <span className="mx-2 text-text-secondary opacity-30">/</span>
                       <span className="text-emerald-400/60">{trade.target}</span>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{trade.size}</td>
                    <td className="px-4 py-4 text-text-secondary opacity-60">{trade.fee || 0}</td>
                    <td className="px-4 py-4 text-text-secondary opacity-80">1:{trade.riskReward}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-black ${getResultColor(trade.result)}`}>
                        {getResultLabel(trade.result)}
                      </span>
                      {trade.labels && trade.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {trade.labels.slice(0, 2).map(label => (
                            <span key={label} className="px-1.5 py-0.5 bg-surface-base border border-surface-border rounded text-[7px] font-mono text-text-secondary">#{label}</span>
                          ))}
                          {trade.labels.length > 2 && <span className="text-[7px] text-text-secondary opacity-40">...</span>}
                        </div>
                      )}
                    </td>
                    <td className={`px-4 py-4 text-center font-black ${trade.profitAmount > 0 ? 'text-emerald-400' : trade.profitAmount < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {trade.profitAmount === 0 ? '0.00' : trade.profitAmount}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.preventDefault(); setEditingTrade(trade); }}
                          className="p-2 bg-surface-base rounded-xl text-text-secondary hover:text-text-primary transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        {trade.notes && (
                          <button 
                            onClick={(e) => { e.preventDefault(); setSelectedTradeNotes(trade); }}
                            className="p-2 bg-surface-base rounded-xl text-text-secondary hover:text-text-primary transition-colors"
                          >
                            <MessageSquare size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.preventDefault(); deleteTrade(trade.id); }}
                          className="p-2 bg-rose-500/10 rounded-xl text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </form>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {trades.length === 0 && !showAddRow && (
          <div className="py-20 text-center text-text-secondary uppercase font-black tracking-widest opacity-50">
            {t('no_trades_in_database') || 'NO_TRADES_IN_DATABASE'}
          </div>
        )}
        {trades.map((trade) => (
          <motion.div 
            key={trade.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-card border border-surface-border rounded-[2rem] p-6 space-y-4 relative group"
            dir={language === 'fa' ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-display font-black text-text-primary">{trade.symbol}</h4>
                <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{trade.date} // {trade.marketType ? t(trade.marketType.toLowerCase()) : t('forex')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl font-display font-black text-[10px] uppercase shadow-lg ${
                  trade.positionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5' : 'bg-rose-500/10 text-rose-400 shadow-rose-500/5'
                }`}>
                  {t(trade.positionType === 'BUY' ? 'buy' : 'sell')}
                </span>
                <button onClick={() => setEditingTrade(trade)} className="p-2 text-text-secondary">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => deleteTrade(trade.id)} className="p-2 text-rose-500/40 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-surface-base rounded-2xl p-4">
                <p className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest mb-1">{t('entry')}</p>
                <p className="text-sm font-display font-black text-text-primary">{trade.entry}</p>
              </div>
              <div className="bg-surface-base rounded-2xl p-4">
                <p className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest mb-1">{t('profit_loss')}</p>
                <p className={`text-sm font-display font-black ${trade.profitAmount > 0 ? 'text-emerald-400' : trade.profitAmount < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {trade.profitAmount > 0 ? '+' : ''}{trade.profitAmount} USD
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest px-1">
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

            {trade.labels && trade.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
                {trade.labels.map(label => (
                  <span key={label} className="px-2 py-1 bg-surface-base border border-surface-border rounded-lg text-[8px] font-mono font-black text-text-secondary opacity-60">
                    #{label}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTrade && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTrade(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl"
              dir={language === 'fa' ? 'rtl' : 'ltr'}
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">{t('edit')}</h3>
                <button 
                  onClick={() => setEditingTrade(null)}
                  className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateTrade} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('symbol')}</label>
                        <input name="symbol" defaultValue={editingTrade.symbol || ''} required className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold uppercase" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('result')}</label>
                        <select name="result" defaultValue={editingTrade.result || 'PENDING'} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold cursor-pointer outline-none focus:border-brand-primary/20 [color-scheme:dark]">
                          <option value="WIN">{t('win_label') || t('win')}</option>
                          <option value="LOSS">{t('loss_label') || t('loss')}</option>
                          <option value="BE">{t('be')}</option>
                          <option value="PENDING">{t('pending')}</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('lot')} / {t('margin')}</label>
                        <input name="size" type="number" step="any" defaultValue={editingTrade.size ?? 0} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('profit_loss')}</label>
                        <input name="profitAmount" type="number" step="any" defaultValue={editingTrade.profitAmount ?? 0} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('fee')}</label>
                        <input name="fee" type="number" step="any" defaultValue={editingTrade.fee || 0} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold" />
                      </div>
                    </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('position')}</label>
                      <select name="positionType" defaultValue={editingTrade.positionType || 'BUY'} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold cursor-pointer outline-none focus:border-brand-primary/20 [color-scheme:dark]">
                        <option value="BUY">{t('buy')}</option>
                        <option value="SELL">{t('sell')}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('market_type')}</label>
                      <select name="marketType" defaultValue={editingTrade.marketType || 'FOREX'} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold cursor-pointer outline-none focus:border-brand-primary/20 [color-scheme:dark]">
                        <option value="FOREX">{t('forex')}</option>
                        <option value="CRYPTO">{t('crypto')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('entry')}</label>
                      <input name="entry" type="number" step="any" defaultValue={editingTrade.entry ?? 0} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest text-rose-400">{t('sl')}</label>
                      <input name="sl" type="number" step="any" defaultValue={editingTrade.stopLoss ?? 0} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-rose-400 font-mono font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest text-emerald-400">{t('tp')}</label>
                      <input name="tp" type="number" step="any" defaultValue={editingTrade.target ?? 0} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-emerald-400 font-mono font-bold" />
                    </div>
                  </div>
  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('date')}</label>
                    <input name="date" type="date" defaultValue={editingTrade.date || ''} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono font-bold" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('labels')}</label>
                    <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 space-y-4">
                      <p className="text-[10px] text-slate-500 italic mb-2">{t('labels_edit_hint') || 'Use commas to separate labels'}</p>
                      <input 
                        id="modal-labels-input"
                        name="labels" 
                        defaultValue={editingTrade.labels?.join(', ') || ''} 
                        placeholder="Strategy A, FOMO, etc"
                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-mono text-xs outline-none focus:border-brand-primary/20" 
                      />

                      {allUsedLabels.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">{t('quick_select') || 'QUICK SELECT'}</p>
                          <div className="flex flex-wrap gap-2">
                            {allUsedLabels.map(label => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('modal-labels-input') as HTMLInputElement;
                                  if (input) {
                                    const currentValues = input.value.split(',').map(v => v.trim()).filter(Boolean);
                                    if (currentValues.includes(label)) {
                                      input.value = currentValues.filter(v => v !== label).join(', ');
                                    } else {
                                      input.value = [...currentValues, label].join(', ');
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('trade_notes')}</label>
                    <textarea name="notes" defaultValue={editingTrade.notes || ''} className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-white font-mono text-sm min-h-[120px]" />
                  </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('labels')}</label>
                    <div className="flex gap-2">
                       <input 
                          id="trade-label-input"
                          placeholder={t('add_label')}
                          className="bg-slate-950 border border-white/5 rounded-xl px-3 py-1.5 text-white font-mono text-[10px] outline-none focus:border-brand-primary/20"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val && !editingTrade.labels?.includes(val)) {
                                setEditingTrade({ ...editingTrade, labels: [...(editingTrade.labels || []), val] });
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                       />
                    </div>
                  </div>

                  {/* Suggestions in Edit Modal */}
                  {allUsedLabels.length > 0 && (
                    <div className="space-y-2 py-1">
                      <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">{t('frequent_labels')}</p>
                      <div className="flex flex-wrap gap-2">
                        {allUsedLabels
                          .filter(l => !editingTrade.labels?.includes(l))
                          .slice(0, 15)
                          .map(label => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setEditingTrade({ ...editingTrade, labels: [...(editingTrade.labels || []), label] })}
                              className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-slate-500 hover:text-white hover:border-brand-primary/40 transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(editingTrade.labels || []).length === 0 && (
                      <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest italic opacity-50">{t('no_labels')}</span>
                    )}
                    {(editingTrade.labels || []).map(label => (
                      <span key={label} className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-[10px] font-mono font-black text-brand-primary flex items-center gap-2">
                        #{label}
                        <button 
                          type="button"
                          onClick={() => setEditingTrade({ ...editingTrade, labels: (editingTrade.labels || []).filter(l => l !== label) })}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-brand-primary text-slate-950 py-5 rounded-2xl font-display font-black uppercase text-sm shadow-lg shadow-brand-primary/20"
                >
                  {t('save')}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
