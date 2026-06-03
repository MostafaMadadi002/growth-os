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
    dashboard: 'پیشخوان استراتژیک',
    journal: 'بایگانی تجربیات',
    goals: 'اهداف عملیاتی',
    habits: 'الگوهای تکرارشونده',
    profile: 'شناسه اپراتور',
    settings: 'تنظیمات هسته',
    welcome: 'دسترسی مجدد تایید شد',
    growth_score: 'امتیاز رشد سیستم',
    productivity: 'بهره‌وری عملیاتی',
    active_goals: 'اهداف در جریان',
    daily_habits: 'پروتکل‌های روزانه',
    logged: 'ثبت شد',
    secured: 'محفوظ',
    momentum: 'مومنتوم',
    streak: 'توالی',
    identity: 'هویت',
    diagnostics: 'عیب‌یابی سیستم',
    status_active: 'سیستم فعال',
    network_secure: 'شبکه ایمن',
    operational: 'عملیاتی',
    trading: 'ترمینال تریدینگ',
    daily: 'روزانه',
    weekly: 'هفتگی',
    monthly: 'ماهانه',
    win_rate: 'نرخ پیروزی',
    total_ops: 'کل عملیات‌ها',
    pnl: 'سود و زیان',
    market_matrix: 'ماتریکس بازار',
    deploy: 'استقرار معامله',
    entry: 'قیمت ورود',
    exit: 'خروج',
    stop_loss: 'حد ضرر',
    take_profit: 'حد سود',
    leverage: 'اهرم',
    lot: 'لات',
    crypto: 'کریپتو',
    forex: 'فارکس',
    win: 'سود',
    loss: 'ضرر',
    risk_free: 'ریسک فری',
    open: 'باز',
  },
  en: {
    dashboard: 'Strategic Dashboard',
    journal: 'Intelligence Archive',
    goals: 'Tactical Objectives',
    habits: 'Recurring Patterns',
    profile: 'Operator Profile',
    settings: 'Core Settings',
    welcome: 'Access Verified',
    growth_score: 'System Growth Score',
    productivity: 'Operational Efficiency',
    active_goals: 'Active Objectives',
    daily_habits: 'Daily Protocols',
    logged: 'LOGGED',
    secured: 'SECURED',
    momentum: 'MOMENTUM',
    streak: 'CYCLE_STREAK',
    identity: 'IDENTITY',
    diagnostics: 'SYSTEM_DIAGNOSTICS',
    status_active: 'SYSTEM_ACTIVE',
    network_secure: 'NETWORK_SECURE',
    operational: 'OPERATIONAL',
    trading: 'TRADING_TERMINAL',
    daily: 'DAILY',
    weekly: 'WEEKLY',
    monthly: 'MONTHLY',
    win_rate: 'WIN_RATE',
    total_ops: 'TOTAL_OPS',
    pnl: 'NET_PNL',
    market_matrix: 'MARKET_MATRIX',
    deploy: 'DEPLOY_TRADE',
    entry: 'ENTRY_PRICE',
    exit: 'EXIT',
    stop_loss: 'SL',
    take_profit: 'TP',
    leverage: 'LVG',
    lot: 'LOT',
    crypto: 'CRYPTO',
    forex: 'FOREX',
    win: 'PROFIT',
    loss: 'LOSS',
    risk_free: 'RISK_FREE',
    open: 'OPEN',
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
