import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  LayoutDashboard, BookText, BarChart3, User, Search
} from 'lucide-react';
import { useI18n } from './core/store/useI18n';
import { useAppStore, UserRole } from './core/stores/appStore';
import { motion, AnimatePresence } from 'motion/react';

// MVP Features
import DashboardScreen from './features/dashboard/DashboardScreen';
import JournalScreen from './features/journal/JournalScreen';
import AnalyticsScreen from './features/analytics/AnalyticsScreen';
import ProfileScreen from './features/profile/ProfileScreen';

const queryClient = new QueryClient();

type TabType = 'Home' | 'Stats' | 'Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const { language, dir, t, setLanguage } = useI18n();
  const { currentRoot, setLanguage: setStoreLanguage } = useAppStore();

  useEffect(() => {
    // Sync language from store to i18n
    const storeLang = useAppStore.getState().language;
    setLanguage(storeLang.toLowerCase() as 'fa' | 'en');
  }, [setLanguage]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <DashboardScreen />;
      case 'Stats': return <AnalyticsScreen />;
      case 'Profile': return <ProfileScreen />;
      default: return <DashboardScreen />;
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'Home', label: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Stats', label: 'analytics', icon: <BarChart3 size={20} /> },
    { id: 'Profile', label: 'profile', icon: <User size={20} /> },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="flex flex-col h-screen w-full bg-slate-950 select-none overflow-hidden text-slate-200"
        dir={dir}
      >
        {/* Modern Header */}
        <header className="px-6 py-4 flex justify-between items-center bg-slate-950/40 backdrop-blur-3xl z-40 border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-brand-primary/20">
                <span className="text-slate-950 font-black text-lg">G</span>
             </div>
             <div>
                <h1 className="text-lg font-display font-black text-white tracking-tighter uppercase leading-none">GrowthOS</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1 h-1 rounded-full animate-pulse ${currentRoot === UserRole.STUDENT ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                  <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{t(currentRoot.toLowerCase() + '_role')}</p>
                </div>
             </div>
          </div>

          <button className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white transition-colors">
            <Search size={18} />
          </button>
        </header>

        {/* content */}
        <main className="flex-1 relative overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab + currentRoot}
               initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
               transition={{ duration: 0.3, ease: 'circOut' }}
               className="h-full overflow-y-auto scrollbar-hide pb-24"
             >
               {renderScreen()}
             </motion.div>
           </AnimatePresence>
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="fixed bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-2xl border-t border-white/[0.03] z-50 px-6 pb-safe pt-2">
          <div className="max-w-md mx-auto flex justify-between items-center h-16">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 px-4 transition-all duration-300 ${activeTab === tab.id ? 'text-brand-primary' : 'text-slate-600 hover:text-slate-400'}`}
              >
                <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
                  {tab.icon}
                </div>
                <span className={`text-[8px] font-mono font-black uppercase tracking-widest transition-opacity duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`}>
                  {t(tab.label).split(' ')[0]}
                </span>
                
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -top-2 w-8 h-8 bg-brand-primary/10 blur-xl rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </QueryClientProvider>
  );
}
