import React from 'react';
import { 
  Globe, Moon, Sun, 
  Settings as SettingsIcon, Monitor
} from 'lucide-react';
import { useAppStore } from '../../core/stores/appStore';
import { useI18n } from '../../core/store/useI18n';
import { motion } from 'motion/react';

export function SettingsScreen() {
  const { language, setLanguage, theme, setTheme } = useAppStore();
  const { t } = useI18n();

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
    </div>
  );
}
