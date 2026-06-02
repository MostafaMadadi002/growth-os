import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home, Book, CheckCircle, Target, TrendingUp, NotebookTabs } from 'lucide-react';
import DashboardScreen from './features/dashboard/DashboardScreen';
// I'll import other screens as well, but first I need to make sure they are web-compatible

const queryClient = new QueryClient();

type TabType = 'Home' | 'Journal' | 'Habits' | 'Goals' | 'Trading' | 'Notes';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <DashboardScreen />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <h2 className="text-2xl font-bold text-slate-400">بخش {activeTab} به زودی...</h2>
          </div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden" dir="rtl">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-slate-800 border-t border-slate-700 flex items-center justify-around px-4 pb-4">
          <TabButton 
            active={activeTab === 'Home'} 
            onClick={() => setActiveTab('Home')}
            icon={<Home size={24} />}
            label="خانه"
          />
          <TabButton 
            active={activeTab === 'Journal'} 
            onClick={() => setActiveTab('Journal')}
            icon={<Book size={24} />}
            label="دفترچه"
          />
          <TabButton 
            active={activeTab === 'Habits'} 
            onClick={() => setActiveTab('Habits')}
            icon={<CheckCircle size={24} />}
            label="عادت‌ها"
          />
          <TabButton 
            active={activeTab === 'Goals'} 
            onClick={() => setActiveTab('Goals')}
            icon={<Target size={24} />}
            label="اهداف"
          />
          <TabButton 
            active={activeTab === 'Trading'} 
            onClick={() => setActiveTab('Trading')}
            icon={<TrendingUp size={24} />}
            label="معاملات"
          />
          <TabButton 
            active={activeTab === 'Notes'} 
            onClick={() => setActiveTab('Notes')}
            icon={<NotebookTabs size={24} />}
            label="یادداشت"
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
      className={`flex flex-col items-center justify-center space-y-1 transition-colors ${active ? 'text-emerald-500' : 'text-slate-500'}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
