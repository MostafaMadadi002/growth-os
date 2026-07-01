import React from 'react';
import { 
  User, GraduationCap, Terminal, 
  Zap, Settings as SettingsIcon
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { motion } from 'motion/react';
import TradingCalendar from '../../components/TradingCalendar';

interface ProfileScreenProps {
  onSettings?: () => void;
}

export default function ProfileScreen({ onSettings }: ProfileScreenProps) {
  const { t, language } = useI18n();
  const { currentRoot, setRoot, studentData, traderData, importData } = useAppStore();

  const totalPnL = (traderData?.trades || []).reduce((sum, trade) => sum + Number(trade.profitAmount || 0), 0);

  // Generate heatmap data for the last 16 weeks (112 days)
  // To align the grid, we find how many days back we need to go to start on a Saturday
  // In JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // We want the start to be Saturday.
  const heatmapData = React.useMemo(() => {
    const today = new Date();
    const daysRequested = 112; // 16 weeks
    
    // Find the current date's weekday (0=Sun, 6=Sat)
    // We want the grid to end on "today" but align rows to weekdays.
    // To make the grid consistent, we should actually start from a Saturday long ago.
    
    // Total days to show including padding to align the first day to a Saturday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysRequested);
    
    // How many days do we need to go back further to hit a Saturday?
    // If startDate is Sun (0), we need to go back 1 day to Sat (6).
    // If startDate is Sat (6), we are good (0 days).
    // offset = (jsDay + 1) % 7
    const dayOfWeek = startDate.getDay();
    const offset = (dayOfWeek + 1) % 7; 
    startDate.setDate(startDate.getDate() - offset);
    
    const totalDaysToRender = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return Array.from({ length: totalDaysToRender }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const log = (studentData.activityLogs || []).find(l => l.date === dateStr);
      
      return {
        date: dateStr,
        intensity: log ? Math.min(Math.max(log.count || 0, 0), 4) : 0,
        score: log?.score ?? 0,
        pos: log?.posCount ?? 0,
        neg: log?.negCount ?? 0,
        dayOfWeek: date.getDay()
      };
    });
  }, [studentData.activityLogs]);

  // JS Day 6 is Saturday. In Persian it's the start of the week.
  // We'll sort the grid so the rows represent: Sat, Sun, Mon, Tue, Wed, Thu, Fri
  // Row Index = (JSDay + 1) % 7
  // Logic: 6 (Sat) -> 0 | 0 (Sun) -> 1 | 1 (Mon) -> 2 ... 5 (Fri) -> 6
  const getRowIndex = (jsDay: number) => (jsDay + 1) % 7;

  const getDayColor = (day: { intensity: number, score: number, pos: number, neg: number }) => {
    // If no activity at all
    if (day.pos === 0 && day.neg === 0) {
      return 'bg-text-secondary/10 border border-surface-border/50';
    }
    
    // If activity exists but they are balanced (Equal)
    if (day.score === 0) {
      return 'bg-amber-500/40 border border-amber-500/20';
    }
    
    // Calculate color based on dominant activity
    // score = pos - neg
    
    if (day.score > 0) {
      // Positive Dominant
      if (day.score >= 4) return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]';
      if (day.score >= 2) return 'bg-emerald-500';
      return 'bg-emerald-600/70';
    } else {
      // Negative Dominant (day.score < 0)
      if (day.score <= -4) return 'bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]';
      if (day.score <= -2) return 'bg-rose-500';
      return 'bg-rose-600/70';
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 w-full pb-20">
        {/* Profile Header */}
        <header className="flex flex-row items-center justify-between gap-8 px-2">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
               <div className="w-16 h-16 md:w-32 md:h-32 bg-surface-card backdrop-blur-xl border border-surface-border rounded-xl md:rounded-3xl flex items-center justify-center relative shadow-lg shrink-0">
                 <User size={28} className="text-brand-primary md:w-12 md:h-12" />
                 <div className={`absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 w-6 h-6 md:w-10 md:h-10 rounded-lg border-4 border-surface-base flex items-center justify-center ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                   {currentRoot === UserRole.STUDENT ? <GraduationCap size={12} className="text-white md:w-5 md:h-5" /> : <Terminal size={12} className="text-white md:w-5 md:h-5" />}
                 </div>
               </div>
            </div>
            <div>
               <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-primary" />
                  <span className="text-[8px] md:text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.1em] md:tracking-[0.2em]">{currentRoot}</span>
               </div>
               <h1 className={`text-2xl md:text-5xl font-display font-black text-text-primary ${language === 'fa' ? 'tracking-normal leading-tight' : 'tracking-tighter leading-none'} uppercase mt-1 md:mt-2`}>
                 {language === 'fa' ? 'مهمان' : 'GUEST'}<span className="text-brand-primary">.</span>
               </h1>
            </div>
          </div>

          <button 
            onClick={onSettings}
            className="flex flex-col items-center justify-center gap-1 min-w-[60px] md:min-w-[72px] px-2 py-2 md:px-3 md:py-3 rounded-xl md:rounded-2xl border border-surface-border bg-surface-card backdrop-blur-xl shadow-sm transition-all duration-500 group hover:border-brand-primary/40 hover:text-brand-primary hover:shadow-brand-primary/5 active:scale-95"
          >
            <SettingsIcon size={20} md:size={24} className="text-text-secondary transition-all duration-700 group-hover:rotate-180 group-hover:text-brand-primary" />
            <span className="text-[8px] md:text-[10px] font-mono font-black uppercase tracking-tight leading-none text-text-secondary group-hover:text-brand-primary">{t('settings')}</span>
          </button>
        </header>

        {/* Root Switcher Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Zap size={16} className="text-brand-primary" />
            </div>
            <h3 className="text-[10px] md:text-[11px] font-mono font-black text-text-secondary uppercase tracking-[0.3em]">{t('identity_control')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => setRoot(UserRole.STUDENT)}
              className={`p-5 md:p-8 rounded-3xl md:rounded-[3rem] border transition-all duration-500 flex items-center justify-between group relative overflow-hidden ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500/10 border-indigo-500/30 backdrop-blur-md' : 'bg-surface-card backdrop-blur-xl border-surface-border opacity-50 hover:opacity-100 shadow-xl'}`}
            >
              <div className="flex items-center gap-4 md:gap-6 relative z-10">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all duration-500 ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-110' : 'bg-surface-base text-text-secondary'}`}>
                  <GraduationCap size={22} md:size={28} />
                </div>
                <div className="text-left">
                  <p className={`text-base md:text-xl font-display font-black leading-tight uppercase ${currentRoot === UserRole.STUDENT ? 'text-text-primary' : 'text-text-secondary'}`}>{t('student_mode').split(' ')[0]}</p>
                  <p className="text-[8px] md:text-[10px] font-mono font-black text-text-secondary uppercase mt-0.5 md:mt-1 tracking-widest opacity-40">Educational_Core</p>
                </div>
              </div>
              {currentRoot === UserRole.STUDENT && <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />}
            </button>

            <button 
              onClick={() => setRoot(UserRole.TRADER)}
              className={`p-5 md:p-8 rounded-3xl md:rounded-[3rem] border transition-all duration-500 flex items-center justify-between group relative overflow-hidden ${currentRoot === UserRole.TRADER ? 'bg-emerald-500/10 border-emerald-500/30 backdrop-blur-md' : 'bg-surface-card backdrop-blur-xl border-surface-border opacity-50 hover:opacity-100 shadow-xl'}`}
            >
              <div className="flex items-center gap-4 md:gap-6 relative z-10">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all duration-500 ${currentRoot === UserRole.TRADER ? 'bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110' : 'bg-surface-base text-text-secondary'}`}>
                  <Terminal size={22} />
                </div>
                <div className="text-left">
                  <p className={`text-base md:text-xl font-display font-black leading-tight uppercase ${currentRoot === UserRole.TRADER ? 'text-text-primary' : 'text-text-secondary'}`}>{t('trader_mode').split(' ')[0]}</p>
                  <p className="text-[8px] md:text-[10px] font-mono font-black text-text-secondary uppercase mt-0.5 md:mt-1 tracking-widest opacity-40">Financial_Node</p>
                </div>
              </div>
              {currentRoot === UserRole.TRADER && <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />}
            </button>
          </div>
        </section>

        {/* Trading Summary - ONLY for Trader */}
        {currentRoot === UserRole.TRADER && (
          <>
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2.5rem] space-y-8 flex flex-col items-center justify-center text-center shadow-xl"
            >
              <div className="space-y-2">
                <h4 className="text-[10px] md:text-xs font-mono font-black text-text-secondary uppercase tracking-[0.4em]">{t('total_pnl')}</h4>
                <div className="flex items-baseline gap-1 md:gap-2 justify-center">
                  <span className={`text-3xl md:text-7xl font-display font-black tracking-tighter ${totalPnL > 0 ? 'text-emerald-400' : totalPnL < 0 ? 'text-rose-400' : 'text-text-secondary'}`}>
                    {totalPnL > 0 ? '+' : ''}{totalPnL.toFixed(1)}
                  </span>
                  <span className="text-base md:text-2xl font-mono font-black text-text-secondary uppercase opacity-60">USD</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-60">TRADES_RECORDED</p>
                  <p className="text-xl font-display font-black text-text-primary">{(traderData?.trades || []).length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-60">WIN_RATE</p>
                  <p className="text-xl font-display font-black text-emerald-400">
                    {traderData?.trades?.length ? Math.round(((traderData.trades.filter(t => t.result === 'WIN').length) / traderData.trades.length) * 100) : 0}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-60">CRYPTO_NODES</p>
                  <p className="text-xl font-display font-black text-blue-400">{(traderData?.trades || []).filter(t => t.marketType === 'CRYPTO').length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-60">FOREX_NODES</p>
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
            className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-6 md:space-y-8 shadow-xl"
          >
            <div className="flex justify-between items-center px-1">
              <div>
                <h4 className="text-base md:text-lg font-display font-black text-text-primary tracking-tight uppercase leading-none">{t('growth_heatmap')}</h4>
                <p className="text-[8px] md:text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest mt-1 opacity-60">SYSTEM_CONTRIBUTIONS // 16_WEEK_LOG</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-widest">{t('today')}</span>
              </div>
            </div>
            
            <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-hide pt-4 relative">
              {/* Day Labels Column */}
              <div className="grid grid-rows-7 gap-1 md:gap-1.5 text-[8px] md:text-[9px] font-mono font-black text-text-secondary uppercase shrink-0 relative z-10">
                <span className="flex items-center h-3 md:h-5 text-brand-primary">{t('sat')}</span>
                <span className="flex items-center h-3 md:h-5 opacity-20">{t('sun')}</span>
                <span className="flex items-center h-3 md:h-5 opacity-40">{t('mon')}</span>
                <span className="flex items-center h-3 md:h-5 opacity-20">{t('tue')}</span>
                <span className="flex items-center h-3 md:h-5 opacity-40">{t('wed')}</span>
                <span className="flex items-center h-3 md:h-5 opacity-20">{t('thu')}</span>
                <span className="flex items-center h-3 md:h-5 opacity-40">{t('fri')}</span>
              </div>

              {/* Heatmap Grid Wrapper */}
              <div className="relative z-10">
                {/* Heatmap Grid */}
                <div className="grid grid-rows-7 grid-flow-col gap-1 md:gap-1.5 auto-cols-max relative">
                  {heatmapData.map((day, i) => {
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    return (
                      <div 
                        key={i} 
                        title={t('heatmap_tooltip')
                          .replace('{date}', day.date)
                          .replace('{score}', (day.score ?? 0).toString())
                          .replace('{pos}', (day.pos ?? 0).toString())
                          .replace('{neg}', (day.neg ?? 0).toString())
                        }
                        className={`w-3 h-3 md:w-5 md:h-5 rounded-sm transition-all duration-500 hover:scale-150 relative cursor-pointer
                          ${getDayColor(day)} 
                          ${isToday ? 'ring-2 ring-brand-primary ring-offset-2 ring-offset-surface-card scale-110 z-20 shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.6)]' : ''}
                        `}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center gap-2 md:gap-4 text-[7px] md:text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest px-1">
               <span className="text-rose-500 shrink-0">{t('bad_habits')}</span>
               <div className="flex gap-1 md:gap-1.5 px-2 py-1.5 md:px-4 md:py-2 bg-surface-base rounded-xl border border-surface-border shrink-0">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-rose-500 rounded-sm" title={t('habits_bad')} />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-rose-600/70 rounded-sm" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-text-secondary/10 border border-surface-border/50 rounded-sm" title={t('empty') || 'EMPTY'} />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-amber-500/40 border border-amber-500/20 rounded-sm" title={language === 'fa' ? 'مساوی' : 'EQUAL'} />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-600/70 rounded-sm" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-sm" title={t('habits_good')} />
               </div>
               <span className="text-emerald-500 shrink-0">{t('good_habits')}</span>
            </div>
          </motion.section>
        )}

        {/* Activity Summary Section */}
        {currentRoot === UserRole.STUDENT && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="p-4 md:p-8 bg-surface-card border border-surface-border rounded-3xl md:rounded-[2.5rem] space-y-4 md:space-y-6 shadow-xl">
                    <h4 className="text-[9px] md:text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('weekly_summary')}</h4>
                    <div className="space-y-3 md:space-y-4">
                        {(studentData.activities || []).slice(-5).reverse().map((act, i) => (
                            <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`w-1 h-1 md:w-2 md:h-2 rounded-full ${act.type === 'POSITIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                                    <span className="text-[11px] md:text-sm font-black text-text-primary truncate max-w-[120px] md:max-w-[200px]">{act.title}</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] font-mono text-text-secondary opacity-60 shrink-0">{act.duration}m</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 md:p-8 bg-surface-card border border-surface-border rounded-3xl md:rounded-[2.5rem] space-y-4 md:space-y-6 shadow-xl">
                    <h4 className="text-[9px] md:text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('active_nodes')}</h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-surface-base p-4 rounded-xl md:rounded-2xl">
                            <p className="text-[8px] md:text-[9px] font-mono font-black text-text-secondary opacity-60 uppercase mb-1">{t('habits_good') || t('positive')}</p>
                            <p className="text-xl md:text-2xl font-display font-black text-emerald-500">
                              {(studentData.activityLogs || []).filter(l => (l.score || 0) > 0).length}
                            </p>
                        </div>
                        <div className="bg-surface-base p-4 rounded-xl md:rounded-2xl">
                            <p className="text-[8px] md:text-[9px] font-mono font-black text-text-secondary opacity-60 uppercase mb-1">{t('habits_bad') || t('negative')}</p>
                            <p className="text-xl md:text-2xl font-display font-black text-rose-500">
                              {(studentData.activityLogs || []).filter(l => (l.score || 0) < 0).length}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* Strategic Goal Summary */}
        {currentRoot === UserRole.STUDENT && studentData.goals?.length > 0 && (
          <section className="p-6 md:p-8 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[2.5rem] space-y-6 shadow-xl">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[9px] md:text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">{t('goal_distribution') || 'STRATEGIC_DISTRIBUTION'}</h4>
              <Zap size={14} className="text-brand-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentData.goals.map(goal => {
                const activities = (studentData.activities || []).filter(a => a.goalId === goal.id);
                const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
                return (
                  <div key={goal.id} className="p-5 bg-surface-base rounded-2xl border border-surface-border space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[12px] font-display font-black text-text-primary uppercase tracking-tight">{goal.title}</p>
                        <p className="text-[9px] font-mono text-text-secondary uppercase opacity-60">{activities.length} {t('sessions')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-black text-brand-primary leading-none">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
                        <p className="text-[8px] font-mono text-text-secondary uppercase mt-1 opacity-40">{t('total_duration') || 'TOTAL_TIME'}</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-surface-card rounded-full overflow-hidden p-[1px] border border-surface-border/50">
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

        <footer className="text-center py-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-40">
              Developed by <span className="text-brand-primary">Mostafa Madadi</span>
            </p>
          </div>
        </footer>
      </div>
  );
}
