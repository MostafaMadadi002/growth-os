import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, TrendingUp, TrendingDown, Activity, 
  ChevronDown, Search, FilterX, MessageSquare, 
  Calendar, Tag
} from 'lucide-react';
import { useAppStore, Trade } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';

import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend
} from 'recharts';

export default function TradingReports() {
  const { t, language } = useI18n();
  const { traderData } = useAppStore();
  const trades = traderData.trades || [];

  const [filterResult, setFilterResult] = useState<string>('ALL');
  const [filterMarket, setFilterMarket] = useState<string>('ALL');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique labels for filter
  const allLabels = useMemo(() => {
    return Array.from(new Set(trades.flatMap(t => t.labels || [])));
  }, [trades]);

  // Filtered trades
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchResult = filterResult === 'ALL' || trade.result === filterResult;
      const matchMarket = filterMarket === 'ALL' || trade.marketType === filterMarket;
      const matchLabels = selectedLabels.length === 0 || 
                         selectedLabels.some(l => trade.labels?.includes(l));
      const matchSearch = searchTerm === '' || 
                         trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchResult && matchMarket && matchLabels && matchSearch;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trades, filterResult, filterMarket, selectedLabels, searchTerm]);

  // Chart Data preparation
  const chartData = useMemo(() => {
    // Equity Curve: Sort by date ASC for cumulative profit
    const sortedForEquity = [...filteredTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativeProfit = 0;
    
    const equityCurve = sortedForEquity.map(t => {
      cumulativeProfit += Number(t.profitAmount || 0) - Number(t.fee || 0);
      return {
        date: t.date,
        profit: Number(cumulativeProfit.toFixed(2))
      };
    });

    // Win/Loss Pie Chart
    const winCount = filteredTrades.filter(t => t.result === 'WIN').length;
    const lossCount = filteredTrades.filter(t => t.result === 'LOSS').length;
    const beCount = filteredTrades.filter(t => t.result === 'BE').length;

    const pieData = [
      { name: t('win') || 'WIN', value: winCount, color: '#10b981' },
      { name: t('loss') || 'LOSS', value: lossCount, color: '#f43f5e' },
      { name: t('be') || 'BE', value: beCount, color: '#a855f7' }
    ].filter(item => item.value > 0);

    // Profit by Label
    const labelProfitMap: Record<string, number> = {};
    filteredTrades.forEach(t => {
      t.labels?.forEach(label => {
        labelProfitMap[label] = (labelProfitMap[label] || 0) + Number(t.profitAmount || 0) - Number(t.fee || 0);
      });
    });

    const barData = Object.entries(labelProfitMap).map(([name, profit]) => ({
      name,
      profit: Number(profit.toFixed(2))
    })).sort((a, b) => b.profit - a.profit);

    return { equityCurve, pieData, barData };
  }, [filteredTrades, t]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isFa = language === 'fa';
      return (
        <div className={`bg-surface-card border border-surface-border p-4 rounded-2xl shadow-xl space-y-3 min-w-[150px] ${isFa ? 'text-right' : 'text-left'}`} dir={isFa ? 'rtl' : 'ltr'}>
          {label && (
            <div className="border-b border-surface-border pb-2">
               <p className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] opacity-40 mb-1">
                 {t('date') || 'DATE'}
               </p>
               <p className="text-xs font-display font-black text-text-primary">
                 {label}
               </p>
            </div>
          )}
          <div className="space-y-2.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <span className="text-[9px] font-mono font-bold text-text-secondary uppercase tracking-widest">
                  {t(entry.name?.toLowerCase()) || entry.name}
                </span>
                <span className="text-sm font-display font-black" style={{ color: entry.color || entry.fill || '#10b981' }}>
                  {entry.value.toLocaleString()} {entry.name === 'profit' ? 'USD' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Stats calculation
  const stats = useMemo(() => {
    const closedTrades = filteredTrades.filter(t => t.result !== 'PENDING');
    const total = closedTrades.length;
    const wins = closedTrades.filter(t => t.result === 'WIN').length;
    const losses = closedTrades.filter(t => t.result === 'LOSS').length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const totalProfit = filteredTrades.reduce((acc, t) => acc + Number(t.profitAmount || 0), 0);
    const totalFees = filteredTrades.reduce((acc, t) => acc + Number(t.fee || 0), 0);
    const netProfit = totalProfit - totalFees;
    
    return {
      totalTrades: total,
      wins,
      losses,
      winRate: winRate.toFixed(1),
      netProfit: netProfit.toFixed(2),
      avgProfit: total > 0 ? (netProfit / total).toFixed(2) : '0.00'
    };
  }, [filteredTrades]);

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'text-emerald-400';
      case 'LOSS': return 'text-rose-400';
      case 'BE': return 'text-purple-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="p-6 pb-32 space-y-8" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      {/* Header & Main Stats */}
      <header className="space-y-6 px-2">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
           <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">{t('performance_analytics') || 'ANALYTICS'}</span>
        </div>
        <h2 className={`text-3xl md:text-6xl font-display font-black text-text-primary ${language === 'fa' ? 'tracking-normal leading-tight' : 'tracking-tighter leading-none'} uppercase`}>
          {t('performance_analytics') || 'Performance Analytics'}<span className="text-brand-primary">.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
          <StatCard 
            label={t('win_rate') || 'Win Rate'} 
            value={`${stats.winRate}%`} 
            subValue={`${stats.wins}W / ${stats.losses}L`}
            icon={<div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20"><Activity className="text-brand-primary" size={24} /></div>} 
          />
          <StatCard 
            label={t('net_profit') || 'Net Profit'} 
            value={`${stats.netProfit} USD`} 
            subValue={`${t('avg_per_trade') || 'Avg:'} ${stats.avgProfit}`}
            icon={<div className={`p-3 rounded-2xl border ${Number(stats.netProfit) > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : Number(stats.netProfit) < 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>{Number(stats.netProfit) >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}</div>} 
          />
          <StatCard 
            label={t('total_trades') || 'Total Trades'} 
            value={stats.totalTrades.toString()} 
            subValue={t('closed_positions') || 'Closed Positions'}
            icon={<div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20"><Calendar className="text-blue-400" size={24} /></div>} 
          />
          <StatCard 
            label={t('filtered_results') || 'Filtered results'} 
            value={filteredTrades.length.toString()} 
            subValue={t('visible_in_list') || 'Visible in list'}
            icon={<div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20"><Filter className="text-amber-400" size={24} /></div>} 
          />
        </div>
      </header>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl p-6 md:p-10 space-y-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-mono font-black text-text-primary uppercase tracking-[0.1em]">{t('equity_curve') || 'Equity Curve'}</h4>
              <p className="text-[10px] text-text-secondary font-mono mt-1 uppercase opacity-60 tracking-widest">{t('cumulative_performance') || 'CUMULATIVE_PERFORMANCE'}</p>
            </div>
            <TrendingUp size={24} className="text-brand-primary opacity-30" />
          </div>
          <div className="h-[250px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.equityCurve}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-surface-border/50" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="currentColor"
                  className="text-text-secondary/40 font-mono"
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-text-secondary/40 font-mono"
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss & Label Analytics */}
        <div className="grid grid-cols-1 gap-6">
          {/* Win/Loss Pie */}
          <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-sm font-mono font-black text-text-primary uppercase tracking-widest">{t('win_loss_distribution') || 'Outcome Matrix'}</h4>
                <p className="text-[10px] text-text-secondary font-mono mt-1 uppercase">{t('trade_distribution') || 'TRADE_DISTRIBUTION'}</p>
              </div>
              <div className="space-y-3">
                {chartData.pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-display font-black text-text-primary">{item.value} {t('trades_label') || 'Trades'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit by Label Bar Chart */}
          <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2.5rem] p-8 space-y-6">
             <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-mono font-black text-text-primary uppercase tracking-widest">{t('profit_by_labels') || 'Strategic Labels'}</h4>
                <p className="text-[10px] text-text-secondary font-mono mt-1 uppercase">{t('pnl_attribution') || 'PNL_ATTRIBUTION'}</p>
              </div>
              <Tag size={20} className="text-blue-400 opacity-50" />
            </div>
            <div className="h-[120px] w-full">
              {chartData.barData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-surface-border rounded-2xl">
                  <p className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">{t('no_label_data') || 'NO_LABEL_DATA_AVAILABLE'}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.barData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#475569" 
                      fontSize={8} 
                      width={80} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: 'currentColor', opacity: 0.05}}
                      content={<CustomTooltip />}
                    />
                    <Bar 
                      dataKey="profit" 
                      radius={[0, 4, 4, 0]}
                    >
                      {chartData.barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input 
              type="text"
              placeholder={t('search_symbol_notes') || 'Search symbol or notes...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-base border border-surface-border rounded-2xl py-4 pl-12 pr-4 text-text-primary font-mono text-sm focus:border-brand-primary/20 outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-mono text-[11px] font-black uppercase tracking-widest border transition-all ${
              showFilters ? 'bg-brand-primary text-slate-950 border-brand-primary' : 'bg-surface-base border-surface-border text-text-secondary hover:border-brand-primary/20'
            }`}
          >
            <Filter size={16} />
            {t('advanced_filters') || 'Advanced Filters'}
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-6 pt-4 border-t border-surface-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status/Market Filters */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('trade_result') || 'Trade Result'}</p>
                    <div className="flex flex-wrap gap-2">
                      {['ALL', 'WIN', 'LOSS', 'BE', 'PENDING'].map(res => (
                        <button
                          key={res}
                          onClick={() => setFilterResult(res)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                            filterResult === res 
                            ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                            : 'bg-surface-base text-text-secondary border-surface-border'
                          } border`}
                        >
                          {res === 'ALL' ? (t('all_results') || 'All') : t(res.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('market_type') || 'Market Type'}</p>
                    <div className="flex flex-wrap gap-2">
                      {['ALL', 'FOREX', 'CRYPTO'].map(m => (
                        <button
                          key={m}
                          onClick={() => setFilterMarket(m)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                            filterMarket === m 
                            ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                            : 'bg-surface-base text-text-secondary border-surface-border'
                          } border`}
                        >
                          {m === 'ALL' ? (t('all_markets') || 'All') : t(m.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Label Filters */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('filter_by_labels') || 'Filter by Labels'}</p>
                    {selectedLabels.length > 0 && (
                      <button onClick={() => setSelectedLabels([])} className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                        <FilterX size={10} /> {t('clear') || 'Clear'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 h-max max-h-[120px] overflow-y-auto p-1 scrollbar-hide">
                    {allLabels.length === 0 && (
                      <p className="text-[10px] text-text-secondary italic">{t('no_labels_available') || 'No labels available'}</p>
                    )}
                    {allLabels.map(label => (
                      <button
                        key={label}
                        onClick={() => toggleLabel(label)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all ${
                          selectedLabels.includes(label)
                          ? 'bg-brand-primary text-slate-950 border-brand-primary'
                          : 'bg-surface-base text-text-secondary border-surface-border'
                        } border`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trades List */}
      <div className="space-y-4">
        {filteredTrades.length === 0 ? (
          <div className="py-20 text-center bg-surface-card border border-dashed border-surface-border rounded-[2.5rem]">
            <Filter className="mx-auto text-text-secondary mb-4 opacity-20" size={48} />
            <p className="text-text-secondary uppercase font-black tracking-widest text-xs">
              {t('no_matching_trades') || 'NO_MATCHING_TRADES_FOUND'}
            </p>
          </div>
        ) : (
          filteredTrades.map((trade) => (
            <motion.div 
              key={trade.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] p-6 hover:border-brand-primary/20 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Metadata */}
                <div className="md:w-48 space-y-2">
                  <div className="flex items-center justify-between md:block">
                    <h4 className="text-xl font-display font-black text-text-primary">{trade.symbol}</h4>
                    <span className={`md:block mt-1 text-[10px] font-mono font-black uppercase tracking-widest ${getResultColor(trade.result)}`}>
                      {t(trade.result.toLowerCase())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest bg-surface-base p-2 rounded-xl">
                    <Calendar size={12} />
                    {trade.date}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase ${
                      trade.positionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {t(trade.positionType.toLowerCase())}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-base text-text-secondary rounded-lg text-[9px] font-mono font-black uppercase">
                      {t(trade.marketType.toLowerCase())}
                    </span>
                  </div>
                </div>

                {/* Middle: Stats Grid */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-4 md:py-0 md:border-x border-surface-border">
                  <MiniStat label={t('profit_loss') || 'P/L'} value={`${trade.profitAmount} USD`} color={getResultColor(trade.result)} />
                  <MiniStat label={t('entry') || 'Entry'} value={trade.entry.toString()} />
                  <MiniStat label={t('risk_reward') || 'R:R'} value={trade.riskReward.toString()} />
                  <MiniStat label={t('size') || 'Size'} value={trade.size.toString()} />
                </div>

                {/* Right Side: Notes & Labels */}
                <div className="md:w-64 space-y-4">
                  {trade.labels && trade.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {trade.labels.map(l => (
                        <span key={l} className="px-2 py-0.5 bg-brand-primary/5 border border-brand-primary/10 rounded flex items-center gap-1 text-[8px] font-mono font-black text-brand-primary">
                          <Tag size={8} /> {l}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {trade.notes ? (
                    <div className="bg-surface-base p-4 rounded-2xl border border-surface-border">
                      <div className="flex items-center gap-2 mb-2 text-text-secondary opacity-60">
                        <MessageSquare size={12} />
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest">{t('trade_notes') || 'Notes'}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary line-clamp-3 italic">
                        "{trade.notes}"
                      </p>
                    </div>
                  ) : (
                     <div className="h-full flex items-center justify-center opacity-20 text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest">
                       {t('no_notes_for_this_trade') || 'NO_NOTES_ATTACHED'}
                     </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, icon }: { label: string, value: string, subValue?: string, icon: React.ReactNode }) {
  return (
    <div className="bg-surface-card backdrop-blur-xl border border-surface-border p-6 rounded-[2rem] space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-display font-black text-text-primary tracking-tighter">{value}</h3>
        {subValue && <p className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest mt-1 opacity-60">{subValue}</p>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest mb-1 opacity-60">{label}</span>
      <span className={`text-xs font-display font-black ${color || 'text-text-primary'}`}>{value}</span>
    </div>
  );
}
