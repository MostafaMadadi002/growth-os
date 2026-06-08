import React from 'react';
import { 
  Globe, Moon, Sun, 
  Settings as SettingsIcon, Monitor,
  Database, Download, Upload
} from 'lucide-react';
import { useAppStore } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion } from 'motion/react';

export function SettingsScreen() {
  const { 
    language, setLanguage, theme, setTheme,
    studentData, traderData, importData 
  } = useAppStore();
  const { t } = useI18n();

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
      <header className="flex justify-between items-center md:items-end px-2">
        <div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
              <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">{t('settings')}</span>
           </div>
           <h1 className="text-3xl md:text-6xl font-display font-black text-text-primary tracking-tighter uppercase leading-none mt-2">
             {t('settings').split(' ')[0]}<span className="text-indigo-500">.</span>
           </h1>
        </div>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-card border border-surface-border rounded-xl md:rounded-2xl flex items-center justify-center text-text-secondary shadow-sm shrink-0">
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
          <div className="p-6 md:p-8 bg-surface-card border border-surface-border rounded-[2rem] md:rounded-[3rem] shadow-sm space-y-6">
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
                onClick={() => setLanguage('en')}
                className={`py-4 rounded-xl font-display font-black uppercase text-xs transition-all ${language === 'en' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('fa')}
                className={`py-4 rounded-xl font-display font-black uppercase text-xs transition-all ${language === 'fa' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                فارسی
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="p-6 md:p-8 bg-surface-card border border-surface-border rounded-[2rem] md:rounded-[3rem] shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-display font-black uppercase tracking-wider text-text-primary">{t('theme_select')}</h4>
                <p className="text-[10px] font-mono text-text-secondary uppercase mt-0.5 opacity-60">Visual Interface Mode</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl font-display font-black uppercase text-[10px] transition-all ${theme === 'light' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                <Sun size={16} />
                {t('light_mode').split(' ')[0]}
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl font-display font-black uppercase text-[10px] transition-all ${theme === 'dark' ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' : 'bg-surface-base border border-surface-border text-text-secondary hover:border-brand-primary/30'}`}
              >
                <Moon size={16} />
                {t('dark_mode').split(' ')[0]}
              </button>
            </div>
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
          <div className="p-6 md:p-8 bg-surface-card border border-surface-border rounded-[2rem] md:rounded-[3rem] space-y-6 group hover:border-brand-primary/20 transition-all shadow-sm">
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

          <div className="p-6 md:p-8 bg-surface-card border border-surface-border rounded-[2rem] md:rounded-[3rem] space-y-6 group hover:border-rose-500/20 transition-all shadow-sm">
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
    </div>
  );
}
