import React from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../core/store/useI18n';
import { useAppStore } from '../core/stores/appStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TradingCalendar() {
  const { t, language } = useI18n();
  const { traderData } = useAppStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const trades = traderData?.trades || [];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const getDailyPnL = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return trades
      .filter(t => t.date === targetDate)
      .reduce((sum, t) => sum + Number(t.profitAmount || 0), 0);
  };

  const getDayStatus = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    const dayTrades = trades.filter(t => t.date === targetDate);
    if (dayTrades.length === 0) return 'neutral';
    const pnl = dayTrades.reduce((sum, t) => sum + Number(t.profitAmount || 0), 0);
    if (pnl > 0) return 'profit';
    if (pnl < 0) return 'loss';
    return 'breakeven';
  };

  const monthNames = language === 'fa' 
    ? ["ژانویه", "فوریه", "مارس", "آوریل", "می", "ژوئن", "جولای", "آگوست", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const weekDays = language === 'fa'
    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
    : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="bg-surface-card border border-surface-border rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-black text-text-primary uppercase tracking-tighter">
          {t('trading_calendar')}
        </h3>
        <div className="flex items-center gap-4 bg-surface-base/50 p-2 rounded-2xl border border-surface-border">
          <button onClick={prevMonth} className="p-2 hover:bg-surface-base rounded-xl text-text-secondary">
            <ChevronLeft size={20} />
          </button>
          <span className="text-[10px] font-mono font-black text-text-primary uppercase tracking-widest min-w-[100px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-surface-base rounded-xl text-text-secondary">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-4" dir={language === 'fa' ? 'rtl' : 'ltr'}>
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest pb-2 opacity-60">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const status = getDayStatus(day);
          const pnl = getDailyPnL(day);
          
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              className={`aspect-square rounded-2xl md:rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border transition-colors ${
                status === 'profit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                status === 'loss' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                status === 'breakeven' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-surface-base border-surface-border text-text-secondary opacity-40'
              }`}
            >
              <span className="text-xs md:text-sm font-display font-black leading-none">{day}</span>
              {status !== 'neutral' && (
                <span className="text-[7px] md:text-[9px] font-mono font-black opacity-80 mt-1">
                  {pnl > 0 ? '+' : ''}{Math.round(pnl)}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
