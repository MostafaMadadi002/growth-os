import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutDashboard, BookText, Target, Activity } from 'lucide-react';
import { useI18n } from './core/store/useI18n';

// MVP Features
import DashboardScreen from './features/dashboard/DashboardScreen';
import JournalScreen from './features/journal/JournalScreen';
import GoalsScreen from './features/goals/GoalsScreen';
import HabitsScreen from './features/habits/HabitsScreen';

const queryClient = new QueryClient();

type TabType = 'Dashboard' | 'Journal' | 'Goals' | 'Habits';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const { language, dir, t, setLanguage } = useI18n();

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardScreen />;
      case 'Journal': return <JournalScreen />;
      case 'Goals': return <GoalsScreen />;
      case 'Habits': return <HabitsScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="flex flex-col h-screen w-full bg-slate-950 select-none"
        dir={dir}
      >
        {/* Top Header - Minimalist */}
        <header className="px-6 py-4 flex justify-between items-center bg-slate-950/50 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">GrowthOS</span>
          </div>
          <button 
            onClick={() => setLanguage(language === 'fa' ? 'en' : 'fa')}
            className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            {language === 'fa' ? 'ENGLISH' : 'فارسی'}
          </button>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </main>

        {/* Professional Bottom Tab Navigator */}
        <nav className="glass-nav h-20 px-4 flex items-center justify-around z-30 pb-2">
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
        </nav>
      </div>
    </QueryClientProvider>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${active ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {active && <div className="active-tab-indicator" />}
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] mt-1.5 font-bold tracking-wide transition-all ${active ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
    </button>
  );
}
