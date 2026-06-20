import React, { useState } from 'react';
import { 
  Target, Activity, CalendarDays, User, Settings as SettingsIcon,
  StickyNote, ArrowLeft
} from 'lucide-react';
import { useI18n } from './core/store/useI18n';
import { useAppStore, UserRole } from './core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

// New Student Features
import GoalsScreen from './features/student/GoalsScreen';
import HabitsScreen from './features/student/HabitsScreen';
import ScheduleScreen from './features/student/ScheduleScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import TradingJournal from './features/trader/TradingJournal';
import TradingReports from './features/trader/TradingReports';
import NotesScreen from './features/notes/NotesScreen';

type TabType = 'Goals' | 'Habits' | 'Schedule' | 'Profile' | 'Journal' | 'Reports' | 'Settings' | 'Notes';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Profile');
  const [previousTab, setPreviousTab] = useState<TabType>('Profile');
  const [slideDirection, setSlideDirection] = useState<number>(0);
  const { dir, t, setLanguage: setI18nLanguage } = useI18n();
  const { currentRoot, theme, notificationsEnabled, studentData, language: appLanguage } = useAppStore();
  const notifiedTasks = React.useRef<Map<string, string>>(new Map());

  // Screen transition variants
  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0
    })
  };

  const handleTabChange = (newTabId: TabType) => {
    if (newTabId !== activeTab) {
      setPreviousTab(activeTab);
    }
    const currentIndex = currentTabs.findIndex(t => t.id === activeTab);
    const nextIndex = currentTabs.findIndex(t => t.id === newTabId);
    
    // In RTL, index increase means moving left (direction = 1 in LTR logic)
    const isRTL = dir === 'rtl';
    const direction = nextIndex > currentIndex ? (isRTL ? -1 : 1) : (isRTL ? 1 : -1);
    
    setSlideDirection(direction);
    setActiveTab(newTabId);
  };

  const onDragEnd = (_: any, info: any) => {
    const threshold = 50;
    const velocityThreshold = 500;
    const { offset, velocity } = info;
    const isRTL = dir === 'rtl';

    const currentIndex = currentTabs.findIndex(t => t.id === activeTab);

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0) {
        // Dragged to the right -> Previous tab (in LTR)
        if (isRTL) {
          // In RTL, dragging right is Next
          if (currentIndex < currentTabs.length - 1) {
            handleTabChange(currentTabs[currentIndex + 1].id);
          }
        } else {
          if (currentIndex > 0) {
            handleTabChange(currentTabs[currentIndex - 1].id);
          }
        }
      } else {
        // Dragged to the left -> Next tab (in LTR)
        if (isRTL) {
          // In RTL, dragging left is Previous
          if (currentIndex > 0) {
            handleTabChange(currentTabs[currentIndex - 1].id);
          }
        } else {
          if (currentIndex < currentTabs.length - 1) {
            handleTabChange(currentTabs[currentIndex + 1].id);
          }
        }
      }
    }
  };

  // Sync Language
  React.useEffect(() => {
    setI18nLanguage(appLanguage === 'FA' ? 'fa' : 'en');
  }, [appLanguage, setI18nLanguage]);

  // Notification Monitor
  React.useEffect(() => {
    if (!notificationsEnabled) return;

    const checkTasks = () => {
      const now = new Date();
      const currentHourMinute = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const today = now.toISOString().split('T')[0];
      
      // Clear notified tasks at the start of a new day
      if (notifiedTasks.current.has('LAST_CHECK_DATE') && notifiedTasks.current.get('LAST_CHECK_DATE') !== today) {
        notifiedTasks.current.clear();
      }
      if (!notifiedTasks.current.has('LAST_CHECK_DATE')) {
        notifiedTasks.current.set('LAST_CHECK_DATE', today);
      }

      const tasks = studentData.tasks || [];
      
      tasks.forEach(task => {
        if (!task.done && task.time === currentHourMinute && !notifiedTasks.current.has(task.id)) {
          // If task has a dueDate, check if it's today
          if (task.dueDate && task.dueDate !== today) return;

          new Notification("GrowthOS Task Reminder", {
            body: `${task.label} at ${task.time}`,
            icon: '/favicon.ico'
          });
          notifiedTasks.current.set(task.id, 'notified');
        }
      });

      // Clear notified tasks for a different time slot if needed
      // (This is simple: if time changes, we could clear it, but keeping it in a Set is safer for HH:mm precision)
    };

    const interval = setInterval(checkTasks, 15000); // Check every 15 seconds for precision
    return () => clearInterval(interval);
  }, [notificationsEnabled, studentData.tasks]);

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
      case 'Profile': return <ProfileScreen onSettings={() => handleTabChange('Settings')} />;
      case 'Settings': return <SettingsScreen onBack={() => handleTabChange('Profile')} />;
      case 'Journal': return <TradingJournal />;
      case 'Reports': return <TradingReports />;
      case 'Notes': return <NotesScreen />;
      default: return <GoalsScreen />;
    }
  };

  const studentTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'Goals', label: 'branch_goals', icon: <Target size={20} /> },
    { id: 'Habits', label: 'branch_habits', icon: <Activity size={20} /> },
    { id: 'Schedule', label: 'schedule', icon: <CalendarDays size={20} /> },
    { id: 'Notes', label: 'branch_notes', icon: <StickyNote size={20} /> },
    { id: 'Profile', label: 'profile', icon: <User size={20} /> },
  ];

  const traderTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'Journal', label: 'trading_journal', icon: <CalendarDays size={20} /> },
    { id: 'Reports', label: 'reports', icon: <Activity size={20} /> },
    { id: 'Notes', label: 'branch_notes', icon: <StickyNote size={20} /> },
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
      <header className="px-6 py-4 mb-2 flex justify-between items-center bg-surface-card z-40 border-b border-surface-border">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group cursor-pointer transition-all hover:scale-110">
              <span className="text-slate-950 font-black text-xl">G</span>
           </div>
            <div>
              <h1 className="text-xl font-display font-black text-text-primary tracking-tighter uppercase leading-none">GrowthOS</h1>
              <div className="flex items-center gap-1.5 mt-1 opacity-60">
                <div className="w-1 h-1 rounded-full animate-pulse bg-brand-primary" />
                <p className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-widest">
                   {currentRoot === UserRole.STUDENT ? 'STUDENT_CORE' : 'TRADER_NODE'}
                </p>
              </div>
            </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-surface-base">
         <AnimatePresence mode="wait" custom={slideDirection}>
           <motion.div
             key={activeTab}
             custom={slideDirection}
             variants={variants}
             initial="initial"
             animate="animate"
             exit="exit"
             drag="x"
             dragConstraints={{ left: 0, right: 0 }}
             dragElastic={0.2}
             onDragEnd={onDragEnd}
             transition={{ 
               x: { type: "spring", stiffness: 300, damping: 30 },
               opacity: { duration: 0.2 }
             }}
             className="h-full overflow-y-auto pb-44 px-2 md:px-4 touch-pan-y"
           >
             <div className="max-w-4xl mx-auto">
               {renderScreen()}
             </div>
           </motion.div>
         </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 md:bottom-6 inset-x-0 md:inset-x-6 h-20 bg-surface-card md:rounded-[2.5rem] z-50 px-2 md:px-8 flex items-center justify-around md:justify-between border-t md:border border-surface-border shadow-2xl max-w-xl mx-auto backdrop-blur-md bg-surface-card/90">
        {currentTabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex-1 md:flex-none p-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-0 ${activeTab === tab.id ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <div className={`transition-all duration-300 ${activeTab === tab.id ? 'scale-110 -translate-y-0.5' : 'scale-100 opacity-50'}`}>
              {React.cloneElement(tab.icon as React.ReactElement, { size: 18 })}
            </div>
            <span className={`text-[8px] md:text-[9px] font-display font-black uppercase tracking-tight md:tracking-widest transition-all duration-300 truncate w-full text-center px-0.5 ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}>
              {t(tab.label)}
            </span>
            
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -bottom-1 w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_10px_#10b981]"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
