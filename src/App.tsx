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
import TradingReports from './features/trader/TradingReports';

type TabType = 'Goals' | 'Habits' | 'Schedule' | 'Profile' | 'Journal' | 'Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Goals');
  const { dir, t } = useI18n();
  const { currentRoot, theme } = useAppStore();

  React.useEffect(() => {
    if (theme === 'DARK') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'Goals': return <GoalsScreen />;
      case 'Habits': return <HabitsScreen />;
      case 'Schedule': return <ScheduleScreen />;
      case 'Profile': return <ProfileScreen />;
      case 'Journal': return <TradingJournal />;
      case 'Reports': return <TradingReports />;
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
    { id: 'Reports', label: 'reports', icon: <Activity size={20} /> },
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
      className="flex flex-col h-screen w-full bg-surface-base select-none overflow-hidden text-text-primary transition-colors duration-500"
      dir={dir}
    >
      <header className="px-6 py-4 flex justify-between items-center bg-surface-base/60 backdrop-blur-3xl z-40 border-b border-surface-border">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center rotate-3 shadow-xl shadow-brand-primary/20 group cursor-pointer transition-all hover:rotate-0 hover:scale-110">
              <span className="text-slate-950 font-black text-xl">G</span>
           </div>
           <div>
              <h1 className="text-xl font-display font-black text-text-primary tracking-tighter uppercase leading-none">GrowthOS</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 rounded-full animate-pulse bg-brand-primary" />
                <p className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest opacity-60">
                  {currentRoot === UserRole.STUDENT ? 'STUDENT_CORE' : 'TRADER_NODE'} // SYSTEM_ACTIVE
                </p>
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden data-grid">
         <div className="absolute inset-0 bg-gradient-to-b from-surface-base/80 via-transparent to-surface-base/80 pointer-events-none" />
         <AnimatePresence mode="wait">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, x: dir === 'ltr' ? 20 : -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: dir === 'ltr' ? -20 : 20 }}
             transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
             className="h-full overflow-y-auto pb-32 pt-6 px-4 md:px-8"
           >
             <div className="max-w-4xl mx-auto">
               {renderScreen()}
             </div>
           </motion.div>
         </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 inset-x-6 h-20 glass-card rounded-[2.5rem] z-50 px-8 flex items-center justify-between shadow-2xl max-w-lg mx-auto">
        {currentTabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-500 ${activeTab === tab.id ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <div className={`transition-all duration-500 ${activeTab === tab.id ? 'scale-110 -translate-y-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'scale-100 opacity-50'}`}>
              {tab.icon}
            </div>
            <span className={`text-[9px] font-display font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}>
              {t(tab.label)}
            </span>
            
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-4 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_10px_#10b981]"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
