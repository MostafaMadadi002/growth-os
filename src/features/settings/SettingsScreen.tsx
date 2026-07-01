import React from 'react';
import { 
  Globe, Moon, Sun, 
  Settings as SettingsIcon, Monitor,
  Database, Download, Upload,
  Bell, BellOff, ArrowLeft
} from 'lucide-react';
import { useAppStore } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  onBack?: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { 
    language: appLanguage, setLanguage: setAppLanguage, 
    theme, setTheme,
    notificationsEnabled, setNotificationsEnabled,
    studentData, traderData, importData 
  } = useAppStore();
  const { t, language: i18nLanguage, setLanguage: setI18nLanguage } = useI18n();

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification(t('notifications_enabled'), {
          body: t('notifications_desc'),
          icon: '/favicon.ico'
        });
      } else {
        alert(t('notifications_permission_denied'));
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleLanguageChange = (lang: 'FA' | 'EN') => {
    setAppLanguage(lang);
    setI18nLanguage(lang === 'FA' ? 'fa' : 'en');
  };

  const handleExport = () => {
    const data = {
      studentData,
      traderData,
      systemMetadata: {
        engine: 'PostgreSQL/Supabase',
        backup_type: 'Relational Export',
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth_os_sql_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.studentData || json.traderData) {
          importData(json);
          alert(t('restore_success'));
        } else {
          alert(t('restore_fail'));
        }
      } catch (error) {
        alert(t('restore_fail'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 md:space-y-12 w-full pb-32">
      <header className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 md:w-16 md:h-16 bg-surface-card backdrop-blur-xl border border-surface-border rounded-xl md:rounded-2xl flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary/30 transition-all shadow-sm shrink-0 active:scale-90"
          >
            <ArrowLeft size={20} md:size={28} />
          </button>
          
          <div>
             <div className="flex items-center gap-2 md:gap-3">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                <span className="text-[8px] md:text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.1em] md:tracking-[0.2em]">{t('settings')}</span>
             </div>
             <h1 className={`text-2xl md:text-5xl font-display font-black text-text-primary ${i18nLanguage === 'fa' ? 'tracking-normal leading-tight' : 'tracking-tighter leading-none'} uppercase mt-1`}>
               {t('settings')}<span className="text-indigo-500">.</span>
             </h1>
          </div>
        </div>
        
        <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/10 border border-brand-primary/30 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-primary shadow-sm shrink-0">
          <SettingsIcon size={24} md:size={28} />
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
           <Monitor size={20} className="text-brand-primary" />
           <h3 className="text-lg font-display font-black uppercase tracking-tight text-text-primary">
             {t('appearance')}
           </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selector */}
          <div className="p-6 md:p-8 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[3rem] shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="text-sm font-display font-black uppercase tracking-wider text-text-primary">{t('language_select')}</h4>
                <p className="text-[10px] font-mono text-text-secondary uppercase mt-0.5 opacity-60">System Context Localization</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleLanguageChange('EN')}
                className={`py-4 rounded-xl font-display font-black uppercase text-xs transition-all ${appLanguage === 'EN' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageChange('FA')}
                className={`py-4 rounded-xl font-display font-black uppercase text-xs transition-all ${appLanguage === 'FA' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                فارسی
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="p-6 md:p-8 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[3rem] shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                {theme === 'DARK' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-display font-black uppercase tracking-wider text-text-primary">{t('theme_select')}</h4>
                <p className="text-[10px] font-mono text-text-secondary uppercase mt-0.5 opacity-60">Visual Interface Mode</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('LIGHT')}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl font-display font-black uppercase text-[10px] transition-all ${theme === 'LIGHT' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                <Sun size={16} />
                {t('light_mode').split(' ')[0]}
              </button>
              <button 
                onClick={() => setTheme('DARK')}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl font-display font-black uppercase text-[10px] transition-all ${theme === 'DARK' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                <Moon size={16} />
                {t('dark_mode').split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
           <Bell size={20} className="text-brand-primary" />
           <h3 className="text-lg font-display font-black uppercase tracking-tight text-text-primary">
             {t('notifications')}
           </h3>
        </div>

        <div className="p-6 md:p-8 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[3rem] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${notificationsEnabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-surface-base text-text-secondary'}`}>
                {notificationsEnabled ? <Bell size={24} /> : <BellOff size={24} />}
              </div>
              <div>
                <h4 className="text-base font-display font-black text-text-primary uppercase leading-none mb-1">{t('push_notifications')}</h4>
                <p className="text-[10px] font-mono text-text-secondary leading-relaxed uppercase opacity-60">{t('notifications_desc')}</p>
              </div>
            </div>

            <button 
              onClick={handleNotificationToggle}
              className={`relative w-20 h-10 rounded-full transition-all duration-500 flex items-center px-1 ${notificationsEnabled ? 'bg-brand-primary shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-surface-base border border-surface-border'}`}
            >
              <motion.div 
                animate={{ x: notificationsEnabled ? (i18nLanguage === 'fa' ? -40 : 40) : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-8 h-8 rounded-full shadow-md ${notificationsEnabled ? 'bg-slate-950' : 'bg-text-secondary/20'}`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <Database size={20} className="text-brand-primary" />
          <h3 className="text-lg font-display font-black uppercase tracking-tight text-text-primary">
            {t('data_management')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 md:p-8 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[3rem] space-y-6 group hover:border-brand-primary/20 transition-all shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Download size={24} />
              </div>
              <div>
                <h4 className="text-base font-display font-black text-text-primary uppercase leading-none mb-1">{t('backup')}</h4>
                <p className="text-[10px] font-mono text-text-secondary leading-relaxed uppercase opacity-60">{t('backup_desc')}</p>
              </div>
            </div>
            <button 
              onClick={handleExport}
              className="w-full py-4 bg-surface-base border border-surface-border rounded-xl text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-slate-950 transition-all shadow-sm"
            >
              {t('export_json')}
            </button>
          </div>

          <div className="p-6 md:p-8 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2rem] md:rounded-[3rem] space-y-6 group hover:border-rose-500/20 transition-all shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div>
                <h4 className="text-base font-display font-black text-text-primary uppercase leading-none mb-1">{t('restore')}</h4>
                <p className="text-[10px] font-mono text-text-secondary leading-relaxed uppercase opacity-60">{t('restore_desc')}</p>
              </div>
            </div>
            <div className="relative">
              <input 
                type="file" 
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <button className="w-full py-4 bg-surface-base border border-surface-border rounded-xl text-[10px] font-mono font-black text-rose-500 uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                {t('import_json')}
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Profile Card Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h3 className="text-lg font-display font-black uppercase tracking-tight text-text-primary">
            Lead Developer
          </h3>
        </div>

        <div className="p-6 md:p-12 bg-surface-card backdrop-blur-xl border border-surface-border rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl relative overflow-hidden group">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-colors duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 md:items-center">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] bg-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner shrink-0">
              <span className="text-2xl md:text-5xl font-display font-black uppercase">MM</span>
            </div>
            
            <div className="space-y-4 flex-1 min-w-0">
              <div>
                <h4 className="text-xl md:text-4xl font-display font-black text-text-primary uppercase tracking-tight leading-none mb-2 break-words">
                  Mostafa Madadi
                </h4>
                <p className="text-[9px] md:text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.3em] opacity-80 italic">Full-Stack Architect & Strategic Partner</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                <div className="flex items-center gap-3 group/link">
                  <span className="text-[8px] font-mono text-text-secondary uppercase opacity-40 group-hover/link:text-brand-primary group-hover/link:opacity-100 transition-all shrink-0">Github //</span>
                  <a href="https://github.com/MostafaMadadi002" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-text-primary hover:text-brand-primary transition-colors truncate" dir="ltr">MostafaMadadi002</a>
                </div>
                <div className="flex items-center gap-3 group/link">
                  <span className="text-[8px] font-mono text-text-secondary uppercase opacity-40 group-hover/link:text-brand-primary group-hover/link:opacity-100 transition-all shrink-0">LinkedIn //</span>
                  <p className="text-[11px] font-mono text-text-primary truncate">Mostafa Madadi</p>
                </div>
                <div className="flex items-center gap-3 group/link">
                  <span className="text-[8px] font-mono text-text-secondary uppercase opacity-40 group-hover/link:text-brand-primary group-hover/link:opacity-100 transition-all shrink-0">Email //</span>
                  <a href="mailto:mostafamadadi.1382@gmail.com" className="text-[11px] font-mono text-text-primary hover:text-brand-primary transition-colors break-all" dir="ltr">mostafamadadi.1382@gmail.com</a>
                </div>
                <div className="flex items-center gap-3 group/link">
                  <span className="text-[8px] font-mono text-text-secondary uppercase opacity-40 group-hover/link:text-brand-primary group-hover/link:opacity-100 transition-all shrink-0">Comm //</span>
                  <p className="text-[11px] font-mono text-text-primary translate-y-[1px]" dir="ltr">+93 78 434 5123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Status Badge */}
      <footer className="pt-12 px-2 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 py-2 px-4 bg-surface-card backdrop-blur-xl border border-surface-border rounded-full">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[8px] font-mono font-black text-text-secondary uppercase tracking-widest leading-none">CORE_SYSTEM_ONLINE // V1.0.4_STABLE</span>
        </div>
        <p className="text-[8px] font-mono text-text-secondary/30 uppercase tracking-[0.4em]">Growth Intelligence Operating System</p>
      </footer>
    </div>
  );
}
