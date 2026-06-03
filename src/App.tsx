import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutDashboard, BookText, Target, Activity, User, Terminal } from 'lucide-react';
import { useI18n } from './core/store/useI18n';
import { useAuthStore } from './core/stores/authStore';

// MVP Features
import DashboardScreen from './features/dashboard/DashboardScreen';
import JournalScreen from './features/journal/JournalScreen';
import GoalsScreen from './features/goals/GoalsScreen';
import HabitsScreen from './features/habits/HabitsScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import DevDashboard from './features/dev/DevDashboard';

const queryClient = new QueryClient();

type TabType = 'Dashboard' | 'Journal' | 'Goals' | 'Habits' | 'Profile' | 'Dev';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const { language, dir, t, setLanguage } = useI18n();
  const { init: initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardScreen />;
      case 'Journal': return <JournalScreen />;
      case 'Goals': return <GoalsScreen />;
      case 'Habits': return <HabitsScreen />;
      case 'Profile': return <ProfileScreen onDevRequest={() => setActiveTab('Dev')} />;
      case 'Dev': return <div className="h-full relative">
        <button onClick={() => setActiveTab('Profile')} className="absolute top-6 left-6 z-50 bg-slate-900/50 p-2 rounded-full text-white">
          <Terminal size={18} />
        </button>
        <DevDashboard />
      </div>;
      default: return <DashboardScreen />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="flex flex-col h-screen w-full bg-slate-950 select-none"
        dir={dir}
      >
        {/* Top Header - Strategic Status */}
        <header className="px-8 py-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-2xl z-20 border-b border-white/[0.03]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-2xl shadow-brand-primary/20">
              <div className="w-5 h-5 border-[3px] border-slate-950 rounded-sm rotate-45" />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-tighter text-white block leading-none">GrowthOS</span>
              <span className="text-[9px] font-mono font-bold text-brand-primary uppercase tracking-[0.3em]">System Active</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-white/[0.05] rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Network Secure</span>
            </div>
            <button 
              onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
              className="text-[10px] font-black bg-slate-900 border border-white/[0.05] px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
            >
              {language === 'fa' ? 'ENGINEERING_EN' : 'ENGINEERING_FA'}
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-hidden relative data-grid">
          {renderScreen()}
        </main>

        {/* Professional Industrial Navigation */}
        <nav className="industrial-nav h-24 px-8 flex items-center justify-around z-30">
          <TabButton 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')}
            icon={<LayoutDashboard size={22} />}
            label={t('dashboard')}
          />
          <TabButton 
            active={activeTab === 'Journal'} 
            onClick={() => setActiveTab('Journal')}
            icon={<BookText size={22} />}
            label={t('journal')}
          />
          <TabButton 
            active={activeTab === 'Goals'} 
            onClick={() => setActiveTab('Goals')}
            icon={<Target size={22} />}
            label={t('goals')}
          />
          <TabButton 
            active={activeTab === 'Habits'} 
            onClick={() => setActiveTab('Habits')}
            icon={<Activity size={22} />}
            label={t('habits')}
          />
          <TabButton 
            active={activeTab === 'Profile'} 
            onClick={() => setActiveTab('Profile')}
            icon={<User size={22} />}
            label="Profile"
          />
        </nav>
      </div>
    </QueryClientProvider>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-20 h-full transition-all duration-500 ${active ? 'text-brand-primary' : 'text-slate-600 hover:text-slate-400'}`}
    >
      {active && (
        <div className="absolute -top-[1px] inset-x-0 flex justify-center">
           <div className="w-12 h-[2px] bg-brand-primary shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
        </div>
      )}
      <div className={`transition-all duration-500 ${active ? 'scale-110 translate-y-[-2px]' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[9px] mt-2 font-black uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}>
        {label}
      </span>
    </button>
  );
}
