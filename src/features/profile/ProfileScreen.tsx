import React from 'react';
import { 
  User, GraduationCap, Terminal, Globe, ChevronRight, 
  LogOut, Shield, Zap
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAppStore, UserRole } from '../../core/stores/appStore';
import { motion } from 'motion/react';

export default function ProfileScreen() {
  const { t, language, setLanguage } = useI18n();
  const { currentRoot, setRoot, studentData } = useAppStore();

  const handleLanguageToggle = () => {
    const newLang = language === 'fa' ? 'EN' : 'FA';
    setLanguage(newLang.toLowerCase() as 'fa' | 'en');
  };

  // Generate heatmap data for the last 112 days
  const heatmapData = Array.from({ length: 112 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (111 - i));
    const dateStr = date.toISOString().split('T')[0];
    const log = (studentData.activityLogs || []).find(l => l.date === dateStr);
    return {
      date: dateStr,
      intensity: log ? Math.min(Math.abs(log.score), 4) : 0,
      score: log ? log.score : 0
    };
  });

  const getDayColor = (day: { intensity: number, score: number }) => {
    if (day.intensity === 0) return 'bg-slate-950';
    if (day.score > 0) {
        if (day.intensity === 1) return 'bg-emerald-500/20';
        if (day.intensity === 2) return 'bg-emerald-500/40';
        if (day.intensity === 3) return 'bg-emerald-500/70';
        return 'bg-emerald-500';
    } else {
        if (day.intensity === 1) return 'bg-rose-500/20';
        if (day.intensity === 2) return 'bg-rose-500/40';
        if (day.intensity === 3) return 'bg-rose-500/70';
        return 'bg-rose-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-44 scrollbar-hide">
      <div className="p-6 md:p-12 space-y-12 max-w-4xl mx-auto w-full">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-900 border border-white/10 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl">
              < User size={40} className="text-brand-primary" />
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-xl border-4 border-slate-950 flex items-center justify-center ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                {currentRoot === UserRole.STUDENT ? <GraduationCap size={14} className="text-white" /> : <Terminal size={14} className="text-white" />}
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-none">{t('profile')}</h1>
              <p className="text-xs font-mono font-black text-slate-500 uppercase tracking-widest mt-2 opacity-60">IDENT_ID // GROWTH_OS_USER</p>
            </div>
          </div>
        </header>

        {/* Root Switcher Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Zap size={14} className="text-brand-primary" />
            <h3 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">{t('identity_control')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setRoot(UserRole.STUDENT)}
              className={`p-6 rounded-[2.5rem] border transition-all flex items-center justify-between group ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900 border-white/5 opacity-50 hover:opacity-100 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${currentRoot === UserRole.STUDENT ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  <GraduationCap size={20} />
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-white leading-tight">{t('student_mode').split(' ')[0]}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mt-1 tracking-wider">Educational_Core</p>
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

        {/* GitHub Heatmap - ONLY for Student */}
        {currentRoot === UserRole.STUDENT && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 space-y-8"
          >
            <div className="flex justify-between items-center px-1">
              <div>
                <h4 className="text-lg font-display font-black text-white tracking-tight uppercase leading-none">{t('growth_heatmap')}</h4>
                <p className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">SYSTEM_CONTRIBUTIONS // 16_WEEK_LOG</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 justify-center">
              {heatmapData.map((day, i) => (
                <div 
                  key={i} 
                  title={`${day.date}: ${day.score}`}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all duration-500 hover:scale-150 relative z-10 ${getDayColor(day)}`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest px-1">
               <span className="text-rose-500">{t('bad_habits')}</span>
               <div className="flex gap-1.5 px-4 py-2 bg-slate-950 rounded-xl border border-white/5">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-xs" />
                  <div className="w-2.5 h-2.5 bg-white/5 rounded-xs" />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
               </div>
               <span className="text-emerald-500">{t('good_habits')}</span>
            </div>
          </motion.section>
        )}

        {/* Activity Summary Section */}
        {currentRoot === UserRole.STUDENT && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
                    <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('weekly_summary')}</h4>
                    <div className="space-y-4">
                        {(studentData.activities || []).slice(-5).reverse().map((act, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${act.type === 'POSITIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                                    <span className="text-sm font-black text-white">{act.title}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">{act.duration}m</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
                    <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{t('active_nodes')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-[9px] font-mono font-black text-slate-600 uppercase mb-1">{t('positive')}</p>
                            <p className="text-2xl font-display font-black text-emerald-500">{(studentData.activities || []).filter(a => a.type === 'POSITIVE').length}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-[9px] font-mono font-black text-slate-600 uppercase mb-1">{t('negative')}</p>
                            <p className="text-2xl font-display font-black text-rose-500">{(studentData.activities || []).filter(a => a.type === 'NEGATIVE').length}</p>
                        </div>
                    </div>
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

        <footer className="text-center py-6">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-white/5 rounded-2xl">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.35em]">GrowthOS // Stable_Release</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
