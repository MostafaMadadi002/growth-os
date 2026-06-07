import React, { useState } from 'react';
import { 
  Target, Activity, CalendarDays, User
} from 'lucide-react';
import { useI18n } from './core/store/useI18n';
import { useAppStore, UserRole } from './core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

// New Student Features
import GoalsScreen from './features/student/GoalsScreen';
import HabitsScreen from './features/student/HabitsScreen';
import ScheduleScreen from './features/student/ScheduleScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import TradingJournal from './features/trader/TradingJournal';

type TabType = 'Goals' | 'Habits' | 'Schedule' | 'Profile' | 'Journal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Goals');
  const { dir, t } = useI18n();
  const { currentRoot } = useAppStore();

  const renderScreen = () => {
    switch (activeTab) {
      case 'Goals': return <GoalsScreen />;
      case 'Habits': return <HabitsScreen />;
      case 'Schedule': return <ScheduleScreen />;
      case 'Profile': return <ProfileScreen />;
      case 'Journal': return <TradingJournal />;
      default: return <GoalsScreen />;
    }
  };

  const studentTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'Goals', label: 'branch_goals', icon: <Target size={20} /> },
    { id: 'Habits', label: 'branch_habits', icon: <Activity size={20} /> },
    { id: 'Schedule', label: 'schedule', icon: <CalendarDays size={20} /> },
    { id: 'Profile', label: 'profile', icon: <User size={20} /> },
  ];

  const traderTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'Journal', label: 'trading_journal', icon: <CalendarDays size={20} /> },
    { id: 'Profile', label: 'profile', icon: <User size={20} /> },
  ];

  const currentTabs = currentRoot === UserRole.STUDENT ? studentTabs : traderTabs;

  // Reset tab if current active tab is not in current root tabs
  React.useEffect(() => {
    if (!currentTabs.find(t => t.id === activeTab)) {
      setActiveTab(currentTabs[0].id);
    }
  }, [currentRoot]);

  return (
    <div 
      className="flex flex-col h-screen w-full bg-slate-950 select-none overflow-hidden text-slate-200"
      dir={dir}
    >
      <header className="px-6 py-4 flex justify-between items-center bg-slate-950/40 backdrop-blur-3xl z-40 border-b border-white/[0.03]">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-brand-primary/20">
              <span className="text-slate-950 font-black text-lg">G</span>
           </div>
           <div>
              <h1 className="text-lg font-display font-black text-white tracking-tighter uppercase leading-none">GrowthOS</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 rounded-full animate-pulse bg-brand-primary" />
                <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                  {currentRoot === UserRole.STUDENT ? 'STUDENT_CORE' : 'TRADER_NODE'} // BY MOSTAFA MADADI
                </p>
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
         <AnimatePresence mode="wait">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.3, ease: 'circOut' }}
             className="h-full overflow-y-auto scrollbar-hide pb-24"
           >
             {renderScreen()}
           </motion.div>
         </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-slate-950/40 backdrop-blur-3xl border-t border-white/10 z-50 px-6 pb-3 sm:pb-8 pt-2">
        <div className="max-w-md mx-auto flex justify-between items-center h-16">
          {currentTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 px-4 transition-all duration-500 ${activeTab === tab.id ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`transition-all duration-500 ${activeTab === tab.id ? 'scale-110 -translate-y-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'scale-100 opacity-60'}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] font-display font-black uppercase tracking-tighter transition-all duration-500 ${activeTab === tab.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                {t(tab.label)}
              </span>
              
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="nav-active-bg"
                  className="absolute -top-3 w-10 h-10 bg-brand-primary/5 blur-xl rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
