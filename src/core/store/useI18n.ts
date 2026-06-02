import { create } from 'zustand';

type Language = 'fa' | 'en';

interface I18nState {
  language: Language;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fa: {
    dashboard: 'پیشخوان',
    journal: 'ژورنال',
    goals: 'اهداف',
    habits: 'عادت‌ها',
    settings: 'تنظیمات',
    welcome: 'خوش آمدی',
    growth_score: 'امتیاز رشد',
    productivity: 'بهره‌وری',
    active_goals: 'اهداف فعال',
    daily_habits: 'عادت‌های روزانه',
  },
  en: {
    dashboard: 'Dashboard',
    journal: 'Journal',
    goals: 'Goals',
    habits: 'Habits',
    settings: 'Settings',
    welcome: 'Welcome Back',
    growth_score: 'Growth Score',
    productivity: 'Productivity',
    active_goals: 'Active Goals',
    daily_habits: 'Daily Habits',
  }
};

export const useI18n = create<I18nState>((set, get) => ({
  language: 'fa',
  dir: 'rtl',
  setLanguage: (lang) => set({ language: lang, dir: lang === 'fa' ? 'rtl' : 'ltr' }),
  t: (key) => {
    const lang = get().language;
    return (translations[lang] as any)[key] || key;
  }
}));
