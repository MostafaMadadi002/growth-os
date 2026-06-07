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
      cumulativeProfit += (t.profitAmount || 0) - (t.fee || 0);
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
      { name: t('be') || 'BE', value: beCount, color: '#f59e0b' }
    ].filter(item => item.value > 0);

    // Profit by Label
    const labelProfitMap: Record<string, number> = {};
    filteredTrades.forEach(t => {
      t.labels?.forEach(label => {
        labelProfitMap[label] = (labelProfitMap[label] || 0) + (t.profitAmount || 0) - (t.fee || 0);
      });
    });

    const barData = Object.entries(labelProfitMap).map(([name, profit]) => ({
      name,
      profit: Number(profit.toFixed(2))
    })).sort((a, b) => b.profit - a.profit);

    return { equityCurve, pieData, barData };
  }, [filteredTrades, t]);

  // Stats calculation
  const stats = useMemo(() => {
    const closedTrades = filteredTrades.filter(t => t.result !== 'PENDING');
    const total = closedTrades.length;
    const wins = closedTrades.filter(t => t.result === 'WIN').length;
    const losses = closedTrades.filter(t => t.result === 'LOSS').length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const totalProfit = filteredTrades.reduce((acc, t) => acc + (t.profitAmount || 0), 0);
    const totalFees = filteredTrades.reduce((acc, t) => acc + (t.fee || 0), 0);
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
      case 'BE': return 'text-amber-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="p-6 pb-32 space-y-8" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      {/* Header & Main Stats */}
      <header className="space-y-6">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tighter uppercase mb-1">
            {t('performance_analytics') || 'Performance Analytics'}
          </h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
            {t('data_summary') || 'DATA_SUMMARY_DASHBOARD'} // {filteredTrades.length} {t('trades_found') || 'TRADES FOUND'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label={t('win_rate') || 'Win Rate'} 
            value={`${stats.winRate}%`} 
            subValue={`${stats.wins}W / ${stats.losses}L`}
            icon={<Activity className="text-brand-primary" size={20} />} 
          />
          <StatCard 
            label={t('net_profit') || 'Net Profit'} 
            value={`${stats.netProfit} USD`} 
            subValue={`${t('avg_per_trade') || 'Avg:'} ${stats.avgProfit}`}
            icon={Number(stats.netProfit) >= 0 ? <TrendingUp className="text-emerald-400" size={20} /> : <TrendingDown className="text-rose-400" size={20} />} 
          />
          <StatCard 
            label={t('total_trades') || 'Total Trades'} 
            value={stats.totalTrades.toString()} 
            subValue={t('closed_positions') || 'Closed Positions'}
            icon={<Calendar className="text-blue-400" size={20} />} 
          />
          <StatCard 
            label={t('filtered_results') || 'Filtered results'} 
            value={filteredTrades.length.toString()} 
            subValue={t('visible_in_list') || 'Visible in list'}
            icon={<Filter className="text-amber-400" size={20} />} 
          />
        </div>
      </header>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-mono font-black text-white uppercase tracking-widest">{t('equity_curve') || 'Equity Curve'}</h4>
              <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">{t('cumulative_performance') || 'CUMULATIVE_PERFORMANCE'}</p>
            </div>
            <TrendingUp size={20} className="text-brand-primary opacity-50" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.equityCurve}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '10px' }}
                  itemStyle={{ color: '#d946ef' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#d946ef" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss & Label Analytics */}
        <div className="grid grid-cols-1 gap-6">
          {/* Win/Loss Pie */}
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-sm font-mono font-black text-white uppercase tracking-widest">{t('win_loss_distribution') || 'Outcome Matrix'}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">{t('trade_distribution') || 'TRADE_DISTRIBUTION'}</p>
              </div>
              <div className="space-y-3">
                {chartData.pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-display font-black text-white">{item.value} {t('trades_label') || 'Trades'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '10px' }}
                  />
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
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
             <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-mono font-black text-white uppercase tracking-widest">{t('profit_by_labels') || 'Strategic Labels'}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">{t('pnl_attribution') || 'PNL_ATTRIBUTION'}</p>
              </div>
              <Tag size={20} className="text-blue-400 opacity-50" />
            </div>
            <div className="h-[120px] w-full">
              {chartData.barData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                  <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{t('no_label_data') || 'NO_LABEL_DATA_AVAILABLE'}</p>
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
                      cursor={{fill: '#ffffff05'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '10px' }}
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
      <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder={t('search_symbol_notes') || 'Search symbol or notes...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-sm focus:border-brand-primary/20 outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-mono text-[11px] font-black uppercase tracking-widest border transition-all ${
              showFilters ? 'bg-brand-primary text-slate-950 border-brand-primary' : 'bg-white/5 border-white/10 text-slate-400 hover:border-brand-primary/20'
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
              className="overflow-hidden space-y-6 pt-4 border-t border-white/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status/Market Filters */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('trade_result') || 'Trade Result'}</p>
                    <div className="flex flex-wrap gap-2">
                      {['ALL', 'WIN', 'LOSS', 'BE', 'PENDING'].map(res => (
                        <button
                          key={res}
                          onClick={() => setFilterResult(res)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                            filterResult === res 
                            ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                            : 'bg-white/5 text-slate-400 border-white/10'
                          } border`}
                        >
                          {res === 'ALL' ? (t('all_results') || 'All') : t(res.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('market_type') || 'Market Type'}</p>
                    <div className="flex flex-wrap gap-2">
                      {['ALL', 'FOREX', 'CRYPTO'].map(m => (
                        <button
                          key={m}
                          onClick={() => setFilterMarket(m)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                            filterMarket === m 
                            ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                            : 'bg-white/5 text-slate-400 border-white/10'
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
                    <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('filter_by_labels') || 'Filter by Labels'}</p>
                    {selectedLabels.length > 0 && (
                      <button onClick={() => setSelectedLabels([])} className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                        <FilterX size={10} /> {t('clear') || 'Clear'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 h-max max-h-[120px] overflow-y-auto p-1 scrollbar-hide">
                    {allLabels.length === 0 && (
                      <p className="text-[10px] text-slate-600 italic">{t('no_labels_available') || 'No labels available'}</p>
                    )}
                    {allLabels.map(label => (
                      <button
                        key={label}
                        onClick={() => toggleLabel(label)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all ${
                          selectedLabels.includes(label)
                          ? 'bg-brand-primary text-slate-950 border-brand-primary'
                          : 'bg-white/5 text-slate-500 border-white/10'
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
          <div className="py-20 text-center bg-slate-900/30 rounded-[2.5rem] border border-dashed border-white/5">
            <Filter className="mx-auto text-slate-700 mb-4 opacity-20" size={48} />
            <p className="text-slate-600 uppercase font-black tracking-widest text-xs">
              {t('no_matching_trades') || 'NO_MATCHING_TRADES_FOUND'}
            </p>
          </div>
        ) : (
          filteredTrades.map((trade) => (
            <motion.div 
              key={trade.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 hover:bg-slate-900 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side: Metadata */}
                <div className="md:w-48 space-y-2">
                  <div className="flex items-center justify-between md:block">
                    <h4 className="text-xl font-display font-black text-white">{trade.symbol}</h4>
                    <span className={`md:block mt-1 text-[10px] font-mono font-black uppercase tracking-widest ${getResultColor(trade.result)}`}>
                      {t(trade.result.toLowerCase())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest bg-white/5 p-2 rounded-xl">
                    <Calendar size={12} />
                    {trade.date}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase ${
                      trade.positionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {t(trade.positionType.toLowerCase())}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 text-slate-500 rounded-lg text-[9px] font-mono font-black uppercase">
                      {t(trade.marketType.toLowerCase())}
                    </span>
                  </div>
                </div>

                {/* Middle: Stats Grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 border-l border-r border-white/5">
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
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-slate-600">
                        <MessageSquare size={12} />
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest">{t('trade_notes') || 'Notes'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-3 italic">
                        "{trade.notes}"
                      </p>
                    </div>
                  ) : (
                     <div className="h-full flex items-center justify-center opacity-20 text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">
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
    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-display font-black text-white tracking-tighter">{value}</h3>
        {subValue && <p className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">{subValue}</p>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-xs font-display font-black ${color || 'text-white'}`}>{value}</span>
    </div>
  );
}
