import React from 'react';
import { 
  User, GraduationCap, Terminal, Globe, ChevronRight, 
  LogOut, Shield, Zap, Download, Upload, Database
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { motion } from 'motion/react';
import TradingCalendar from '../../components/TradingCalendar';

export default function ProfileScreen() {
  const { t, language, setLanguage } = useI18n();
  const { currentRoot, setRoot, studentData, traderData, importData } = useAppStore();

  const handleLanguageToggle = () => {
    const newLang = language === 'fa' ? 'EN' : 'FA';
    setLanguage(newLang.toLowerCase() as 'fa' | 'en');
  };

  const handleExport = () => {
    const data = {
      studentData,
      traderData,
      systemMetadata: {
        engine: 'PostgreSQL/Supabase',
        backup_type: 'Relational Export',
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth_os_sql_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.studentData || json.traderData) {
          importData(json);
          alert(t('restore_success'));
        } else {
          alert(t('restore_fail'));
        }
      } catch (error) {
        alert(t('restore_fail'));
      }
    };
    reader.readAsText(file);
  };

  const totalPnL = (traderData?.trades || []).reduce((sum, trade) => sum + (trade.profitAmount || 0), 0);

  // Generate heatmap data for the last 112 days
  const heatmapData = Array.from({ length: 112 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (111 - i));
    const dateStr = date.toISOString().split('T')[0];
    const log = (studentData.activityLogs || []).find(l => l.date === dateStr);
    return {
      date: dateStr,
      intensity: log ? Math.min(Math.abs(log.score || 0), 4) : 0,
      score: log ? log.score : 0,
      pos: log ? (log.posCount || (log.score > 0 ? log.score : 0)) : 0,
      neg: log ? (log.negCount || (log.score < 0 ? Math.abs(log.score) : 0)) : 0
    };
  });

  const getDayColor = (day: { intensity: number, score: number, pos: number, neg: number }) => {
    if (day.intensity === 0) return 'bg-slate-950';
    
    const total = day.pos + day.neg;
    const balance = total > 0 ? day.pos / total : 0.5;
    
    if (balance >= 0.9) {
        if (day.intensity === 1) return 'bg-emerald-500/20';
        if (day.intensity === 2) return 'bg-emerald-500/40';
        if (day.intensity === 3) return 'bg-emerald-500/70';
        return 'bg-emerald-500';
    }
    if (balance >= 0.6) {
        if (day.intensity === 1) return 'bg-teal-500/20';
        if (day.intensity === 2) return 'bg-teal-500/40';
        if (day.intensity === 3) return 'bg-teal-500/70';
        return 'bg-teal-500';
    }
    if (balance >= 0.4) {
        if (day.intensity === 1) return 'bg-slate-700/30';
        if (day.intensity === 2) return 'bg-slate-700/50';
        if (day.intensity === 3) return 'bg-slate-700/80';
        return 'bg-slate-700';
    }
    if (balance >= 0.2) {
        if (day.intensity === 1) return 'bg-orange-500/20';
        if (day.intensity === 2) return 'bg-orange-500/40';
        if (day.intensity === 3) return 'bg-orange-500/70';
        return 'bg-orange-500';
    }
    if (day.intensity === 1) return 'bg-rose-500/20';
    if (day.intensity === 2) return 'bg-rose-500/40';
    if (day.intensity === 3) return 'bg-rose-500/70';
    return 'bg-rose-500';
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
      <div className="p-4 md:p-12 space-y-8 md:space-y-12 max-w-4xl mx-auto w-full">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-900 border border-white/10 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center relative shadow-2xl shrink-0">
              <User size={24} md:size={40} className="text-brand-primary" />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-2 md:border-4 border-slate-950 flex items-center justify-center ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                {currentRoot === UserRole.STUDENT ? <GraduationCap size={10} md:size={14} className="text-white" /> : <Terminal size={10} md:size={14} className="text-white" />}
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-black text-white tracking-tighter uppercase leading-none">Mostafa Madadi</h1>
              <p className="text-[9px] md:text-xs font-mono font-black text-slate-500 uppercase tracking-widest mt-1 md:mt-2 opacity-60">IDENT_ID // {language === 'fa' ? 'مصطفی مددی' : 'MOSTAFA MADADI'}</p>
            </div>
          </div>
        </header>

        {/* Root Switcher Section */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Zap size={14} className="text-brand-primary" />
            <h3 className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">{t('identity_control')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <button 
              onClick={() => setRoot(UserRole.STUDENT)}
              className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all flex items-center justify-between group ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900 border-white/5 opacity-50 hover:opacity-100 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  <GraduationCap size={18} md:size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm md:text-base font-black text-white leading-tight">{t('student_mode').split(' ')[0]}</p>
                  <p className="text-[8px] md:text-[9px] font-mono text-slate-500 uppercase mt-0.5 md:mt-1 tracking-wider">Educational_Core</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setRoot(UserRole.TRADER)}
              className={`p-6 rounded-[2.5rem] border transition-all flex items-center justify-between group ${currentRoot === UserRole.TRADER ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-white/5 opacity-50 hover:opacity-100 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${currentRoot === UserRole.TRADER ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  <Terminal size={20} />
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-white leading-tight">{t('trader_mode').split(' ')[0]}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mt-1 tracking-wider">Financial_Node</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Trading Summary - ONLY for Trader */}
        {currentRoot === UserRole.TRADER && (
          <>
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-8 flex flex-col items-center justify-center text-center"
            >
              <div className="space-y-2">
                <h4 className="text-[10px] md:text-xs font-mono font-black text-slate-500 uppercase tracking-[0.4em]">{t('total_pnl')}</h4>
                <div className="flex items-baseline gap-2 justify-center">
                  <span className={`text-4xl md:text-7xl font-display font-black tracking-tighter ${totalPnL > 0 ? 'text-emerald-400' : totalPnL < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {totalPnL > 0 ? '+' : ''}{totalPnL}
                  </span>
                  <span className="text-xl md:text-2xl font-mono font-black text-slate-600 uppercase">USD</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">TRADES_RECORDED</p>
                  <p className="text-xl font-display font-black text-white">{(traderData?.trades || []).length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">WIN_RATE</p>
                  <p className="text-xl font-display font-black text-emerald-400">
                    {traderData?.trades?.length ? Math.round(((traderData.trades.filter(t => t.result === 'WIN').length) / traderData.trades.length) * 100) : 0}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">CRYPTO_NODES</p>
                  <p className="text-xl font-display font-black text-blue-400">{(traderData?.trades || []).filter(t => t.marketType === 'CRYPTO').length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">FOREX_NODES</p>
                  <p className="text-xl font-display font-black text-amber-400">{(traderData?.trades || []).filter(t => t.marketType === 'FOREX').length}</p>
                </div>
              </div>
            </motion.section>

            <TradingCalendar />
          </>
        )}

        {/* GitHub Heatmap - ONLY for Student */}
        {currentRoot === UserRole.STUDENT && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-6 md:space-y-8"
          >
            <div className="flex justify-between items-center px-1">
              <div>
                <h4 className="text-base md:text-lg font-display font-black text-white tracking-tight uppercase leading-none">{t('growth_heatmap')}</h4>
                <p className="text-[8px] md:text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">SYSTEM_CONTRIBUTIONS // 16_WEEK_LOG</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 md:gap-1.5 justify-center">
              {heatmapData.map((day, i) => (
                <div 
                  key={i} 
                  title={`${day.date} | Pos: ${day.pos} Neg: ${day.neg} | Balance: ${day.pos + day.neg > 0 ? Math.round((day.pos/(day.pos+day.neg))*100) : 0}%`}
                  className={`w-2.5 h-2.5 md:w-4 md:h-4 rounded-sm transition-all duration-500 hover:scale-150 relative z-10 ${getDayColor(day)}`}
                />
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest px-1">
               <span className="text-rose-500">{t('bad_habits')}</span>
               <div className="flex gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-slate-950 rounded-xl border border-white/5">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-rose-500 rounded-xs" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-orange-500 rounded-xs" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-slate-700 rounded-xs" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-teal-500 rounded-xs" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-xs" />
               </div>
               <span className="text-emerald-500">{t('good_habits')}</span>
            </div>
          </motion.section>
        )}

        {/* Activity Summary Section */}
        {currentRoot === UserRole.STUDENT && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="p-6 md:p-8 bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] space-y-4 md:space-y-6">
                    <h4 className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('weekly_summary')}</h4>
                    <div className="space-y-3 md:space-y-4">
                        {(studentData.activities || []).slice(-5).reverse().map((act, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${act.type === 'POSITIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                                    <span className="text-[12px] md:text-sm font-black text-white truncate max-w-[150px]">{act.title}</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-mono text-slate-500 shrink-0">{act.duration}m</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 md:p-8 bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] space-y-4 md:space-y-6">
                    <h4 className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('active_nodes')}</h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-white/5 p-4 rounded-xl md:rounded-2xl">
                            <p className="text-[8px] md:text-[9px] font-mono font-black text-slate-600 uppercase mb-1">{t('positive')}</p>
                            <p className="text-xl md:text-2xl font-display font-black text-emerald-500">{(studentData.activities || []).filter(a => a.type === 'POSITIVE').length}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl md:rounded-2xl">
                            <p className="text-[8px] md:text-[9px] font-mono font-black text-slate-600 uppercase mb-1">{t('negative')}</p>
                            <p className="text-xl md:text-2xl font-display font-black text-rose-500">{(studentData.activities || []).filter(a => a.type === 'NEGATIVE').length}</p>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* Strategic Goal Summary */}
        {currentRoot === UserRole.STUDENT && studentData.goals?.length > 0 && (
          <section className="p-6 md:p-8 bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[9px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('goal_distribution') || 'STRATEGIC_DISTRIBUTION'}</h4>
              <Zap size={14} className="text-brand-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentData.goals.map(goal => {
                const activities = (studentData.activities || []).filter(a => a.goalId === goal.id);
                const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
                return (
                  <div key={goal.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[12px] font-display font-black text-white uppercase tracking-tight">{goal.title}</p>
                        <p className="text-[9px] font-mono text-slate-500 uppercase">{activities.length} {t('sessions')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-black text-brand-primary leading-none">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
                        <p className="text-[8px] font-mono text-slate-700 uppercase mt-1">{t('total_duration') || 'TOTAL_TIME'}</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-[1px]">
                      <div 
                        className="h-full bg-brand-primary rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (goal.completedSessions / goal.totalSessions) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Configuration Section */}
        <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/[0.03]">
          <button 
            onClick={handleLanguageToggle}
            className="w-full p-8 flex items-center justify-between hover:bg-white/[0.01] transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase">{t('language')}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{language === 'fa' ? 'Persian (IR)' : 'English (US)'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-mono font-black text-brand-primary uppercase bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/20">{language.toUpperCase()}</span>
               <ChevronRight size={16} className="text-slate-800" />
            </div>
          </button>

          <button className="w-full p-8 flex items-center justify-between hover:bg-white/[0.01] transition-colors group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-white uppercase">{t('security')}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Core system integrity check</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-800" />
          </button>

          <button className="w-full p-8 flex items-center justify-between text-rose-500 hover:bg-rose-500/5 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                <LogOut size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase">Terminate Node Connection</p>
                <p className="text-[10px] font-mono text-rose-500/50 uppercase tracking-widest mt-1">Power down session</p>
              </div>
            </div>
            <LogOut size={18} />
          </button>
        </section>

        {/* Data Security & Backup */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Database size={14} className="text-amber-500" />
              <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">{t('data_management')}</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest">{t('data_integrity')}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-brand-primary/20 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Download size={24} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white uppercase leading-none mb-1">{t('backup')}</h4>
                  <p className="text-[10px] font-mono text-slate-500 leading-relaxed uppercase">{t('backup_desc')}</p>
                </div>
              </div>
              <button 
                onClick={handleExport}
                className="w-full py-4 bg-slate-950 border border-brand-primary/20 rounded-2xl text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-slate-950 transition-all shadow-xl shadow-brand-primary/5"
              >
                {t('export_json')}
              </button>
            </div>

            <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-rose-500/20 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white uppercase leading-none mb-1">{t('restore')}</h4>
                  <p className="text-[10px] font-mono text-slate-500 leading-relaxed uppercase">{t('restore_desc')}</p>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <button className="w-full py-4 bg-slate-950 border border-rose-500/20 rounded-2xl text-[10px] font-mono font-black text-rose-500 uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all">
                  {t('import_json')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-white/5 rounded-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.35em]">GrowthOS // Stable_Release</span>
            </div>
            <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest">
              Developed by <span className="text-brand-primary">Mostafa Madadi</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
