import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Lock, CheckCircle2, Zap, 
  ChevronRight, Award, Target, Flame 
} from 'lucide-react';
import { useI18n } from '../../core/store/useI18n';
import { useAchievementStore } from './stores/achievementStore';
import { useActivityStore } from '../../core/stores/activityStore';
import { ACHIEVEMENT_DEFINITIONS, AchievementKey } from './types';

export default function AchievementScreen() {
  const { t, language } = useI18n();
  const { unlocked, fetchUnlocked, checkNewAchievements } = useAchievementStore();
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchUnlocked();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      checkNewAchievements(activities);
    }
  }, [activities]);

  const allAchievements = Object.values(ACHIEVEMENT_DEFINITIONS);

  return (
    <div className="h-full bg-slate-950 overflow-y-auto pb-32 scrollbar-hide">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 md:space-y-16">
        
        {/* Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <span className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.4em] mb-4 block">System_Validation // Rewards</span>
              <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase">{t('achievements')}</h1>
           </div>
           <div className="flex gap-8 bg-slate-900/50 border border-white/[0.03] p-6 rounded-3xl backdrop-blur-xl">
              <div>
                 <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Total_Unlocked</span>
                 <span className="text-3xl font-mono font-black text-brand-primary">{unlocked.length} <span className="text-sm text-slate-700">/ {allAchievements.length}</span></span>
              </div>
           </div>
        </section>

        {/* Categories / Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {allAchievements.map((def, idx) => {
              const isUnlocked = unlocked.some(a => a.id === def.key);
              const unlockData = unlocked.find(a => a.id === def.key);

              return (
                <motion.div 
                  key={def.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative group p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                    isUnlocked 
                      ? 'bg-slate-900 border-white/[0.08] shadow-2xl shadow-brand-primary/5' 
                      : 'bg-slate-900/40 border-white/[0.03] grayscale opacity-60 hover:grayscale-0'
                  }`}
                >
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-all text-brand-primary ${isUnlocked ? 'animate-pulse' : ''}`}>
                    <Trophy size={80} />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl ${
                        isUnlocked ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-slate-950 text-slate-600 border border-white/[0.03]'
                      }`}>
                        {isUnlocked ? def.icon : <Lock size={20} />}
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-mono font-black tracking-widest uppercase ${isUnlocked ? 'text-brand-primary' : 'text-slate-600'}`}>
                          +{def.points} XP
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <h3 className={`text-xl font-display font-black tracking-tight uppercase ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {t(def.key)}
                      </h3>
                      <p className={`text-[11px] leading-relaxed font-medium ${isUnlocked ? 'text-slate-400' : 'text-slate-700'}`}>
                        {t(`${def.key}_DESC`)}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {isUnlocked ? (
                        <div className="flex items-center gap-2 text-[9px] font-mono font-black text-emerald-500 uppercase tracking-widest">
                          <CheckCircle2 size={12} />
                          Unlocked: {unlockData?.unlocked_at ? new Date(unlockData.unlocked_at).toLocaleDateString() : 'N/A'}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                             <div className="w-1/3 h-full bg-slate-800" />
                          </div>
                          <span className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest block">
                            Status: Locked_By_System
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Achievement Pulse / CTA */}
        <section className="bg-slate-900 border border-white/[0.05] p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-right">
                 <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter uppercase mb-4">Master Consistency.</h2>
                 <p className="text-slate-500 text-sm md:text-lg max-w-md">Complete missions, maintain streaks, and evolve your Growth Intelligence to unlock elite status categories.</p>
              </div>
              <button className="px-10 py-5 bg-brand-primary text-slate-950 rounded-2xl font-mono font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">
                 System_Overview
              </button>
           </div>
        </section>

      </div>
    </div>
  );
}
