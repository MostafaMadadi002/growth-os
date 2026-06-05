import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  LayoutDashboard, BookText, Target, Activity, User, 
  Terminal, GraduationCap, BarChart3, Trophy, ChevronUp, Layers
} from 'lucide-react';
import { useI18n } from './core/store/useI18n';
import { useAuthStore } from './core/stores/authStore';
import { useAppStore, UserRole } from './core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

// MVP Features
import DashboardScreen from './features/dashboard/DashboardScreen';
import JournalScreen from './features/journal/JournalScreen';
import GoalsScreen from './features/goals/GoalsScreen';
import HabitsScreen from './features/habits/HabitsScreen';
import TradingScreen from './features/trading/TradingScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import LearningScreen from './features/learning/LearningScreen';
import AnalyticsScreen from './features/analytics/AnalyticsScreen';
import AchievementScreen from './features/achievements/AchievementScreen';
import DevDashboard from './features/dev/DevDashboard';

const queryClient = new QueryClient();

type TabType = 'Dashboard' | 'Journal' | 'Goals' | 'Habits' | 'Trading' | 'Learning' | 'Analytics' | 'Achievements' | 'Profile' | 'Dev';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, dir, t, setLanguage } = useI18n();
  const { init: initAuth } = useAuthStore();
  const { activeRole } = useAppStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Scoped Tabs based on Role (Tree Structure)
  const roleTrees: Record<UserRole, { label: string, branches: { id: TabType, label: string, icon: React.ReactNode }[] }[]> = {
    [UserRole.STUDENT]: [
      { 
        label: 'root_student', 
        branches: [
          { id: 'Dashboard', label: 'dashboard', icon: <LayoutDashboard size={18} /> },
          { id: 'Goals', label: 'branch_goals', icon: <Target size={18} /> },
          { id: 'Habits', label: 'branch_habits', icon: <Activity size={18} /> },
          { id: 'Journal', label: 'branch_notes', icon: <BookText size={18} /> },
        ]
      }
    ],
    [UserRole.TRADER]: [
      { 
        label: 'root_trader', 
        branches: [
          { id: 'Dashboard', label: 'dashboard', icon: <LayoutDashboard size={18} /> },
          { id: 'Trading', label: 'branch_journal', icon: <Terminal size={18} /> },
          { id: 'Analytics', label: 'branch_charts', icon: <BarChart3 size={18} /> },
          { id: 'Journal', label: 'trading_notes', icon: <BookText size={18} /> },
        ]
      }
    ],
  };

  const currentTree = roleTrees[activeRole || UserRole.STUDENT];

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardScreen />;
      case 'Journal': return <JournalScreen />;
      case 'Goals': return <GoalsScreen />;
      case 'Habits': return <HabitsScreen />;
      case 'Trading': return <TradingScreen />;
      case 'Learning': return <LearningScreen />;
      case 'Analytics': return <AnalyticsScreen />;
      case 'Achievements': return <AchievementScreen />;
      case 'Profile': return <ProfileScreen onDevRequest={() => setActiveTab('Dev')} />;
      case 'Dev': return (
        <div className="h-full relative">
          <button onClick={() => setActiveTab('Profile')} className="absolute top-6 left-6 z-50 bg-slate-900/50 p-2 rounded-full text-white">
            <Terminal size={18} />
          </button>
          <DevDashboard />
        </div>
      );
      default: return <DashboardScreen />;
    }
  };

  const getIcon = (tab: TabType) => {
    switch (tab) {
      case 'Dashboard': return <LayoutDashboard />;
      case 'Journal': return <BookText />;
      case 'Goals': return <Target />;
      case 'Habits': return <Activity />;
      case 'Trading': return <Terminal />;
      case 'Learning': return <GraduationCap />;
      case 'Analytics': return <BarChart3 />;
      case 'Achievements': return <Trophy />;
      case 'Profile': return <User />;
      default: return <Layers />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="flex flex-col h-screen w-full bg-slate-950 select-none overflow-hidden"
        dir={dir}
      >
        {/* Minimal Header */}
        <header className="px-6 md:px-12 py-6 flex justify-between items-center bg-slate-950/20 backdrop-blur-3xl z-40 border-b border-white/[0.02]">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center">
                <span className="text-brand-primary font-black text-xl">G</span>
             </div>
             <div>
                <h1 className="text-xl font-display font-black text-white tracking-tighter uppercase leading-none">GrowthOS</h1>
                <p className="text-[10px] font-mono font-black text-brand-primary mt-1 uppercase tracking-widest">{t(activeRole.toLowerCase() + '_role')}</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button 
               onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
               className="text-[10px] font-mono font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
             >
               {language === 'fa' ? 'EN' : 'FA'}
             </button>
             <button 
               onClick={() => setActiveTab('Profile')}
               className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'Profile' ? 'bg-brand-primary text-slate-950 shadow-2xl' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
             >
               <User size={18} />
             </button>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 relative overflow-hidden data-grid">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="h-full"
             >
               {renderScreen()}
             </motion.div>
           </AnimatePresence>
        </main>

        {/* Tree Navigation Root */}
        <div className="fixed bottom-0 inset-x-0 z-50 p-6 pointer-events-none">
           <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
              
              {/* The "Explorer" Tree Structure */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="bg-slate-900/98 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl flex flex-col gap-10 pointer-events-auto min-w-[340px] max-h-[85vh] overflow-y-auto scrollbar-hide"
                  >
                    {/* Level 1: Root Selector */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 px-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                          <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">{t('select_role')}</span>
                       </div>
                       <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-white/5">
                          {[UserRole.STUDENT, UserRole.TRADER].map((role) => (
                            <button
                              key={role}
                              onClick={() => useAppStore.getState().setActiveRole(role)}
                              className={`flex-1 py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeRole === role ? 'bg-slate-800 text-brand-primary shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                               {role === UserRole.STUDENT && <GraduationCap size={16} />}
                               {role === UserRole.TRADER && <Terminal size={16} />}
                               <span className="text-[8px] font-mono font-black uppercase">{t(role.toLowerCase() + '_role').split(' ')[0]}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Level 2: Branch Navigation */}
                    {currentTree.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                           <div className="w-1 h-3 rounded-full bg-brand-primary" />
                           <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em]">{t(group.label)}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {group.branches.map(branch => (
                            <button 
                              key={branch.id}
                              onClick={() => {
                                setActiveTab(branch.id);
                                setIsMenuOpen(false);
                              }}
                              className={`flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${
                                activeTab === branch.id 
                                  ? 'bg-brand-primary border-brand-primary text-slate-950 font-black shadow-xl shadow-brand-primary/20 scale-[1.02]' 
                                  : 'bg-slate-950/50 border-white/[0.03] text-slate-400 hover:bg-slate-800 hover:border-white/10'
                              }`}
                            >
                               <div className={`${activeTab === branch.id ? 'text-slate-950' : 'text-brand-primary/60'}`}>
                                 {branch.icon}
                               </div>
                               <div className="flex flex-col items-start translate-y-[-1px]">
                                 <span className="text-xs font-mono uppercase tracking-[0.15em]">{t(branch.label)}</span>
                                 <span className="text-[8px] opacity-60 font-mono">NODE_LOG // ACTIVE</span>
                               </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Explorer Button (Tree Root) */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-slate-900 border border-white/10 w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center text-white pointer-events-auto shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
              >
                 <div className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-180 scale-125' : 'rotate-0'}`}>
                    <ChevronUp size={24} className={isMenuOpen ? 'text-brand-primary' : 'text-slate-500'} />
                 </div>
                 <span className="text-[8px] font-mono font-black mt-1 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Explorer</span>
                 
                 {isMenuOpen && (
                    <motion.div 
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-brand-primary/5 blur-xl pointer-events-none"
                    />
                 )}
              </button>
           </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
