import React from 'react';

export default function DashboardScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-slate-900 p-6 text-center">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl font-bold text-emerald-500 mb-2">GrowthOS</h1>
        <h2 className="text-xl text-slate-300 font-medium mb-6">به سیستم عامل رشد خوش آمدید</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-emerald-400 font-medium leading-relaxed">امروز برای رشد خود چه برنامه‌ای دارید؟</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700 rounded-2xl hover:bg-slate-600 transition-colors cursor-pointer">
              <span className="text-2xl block mb-1">📝</span>
              <span className="text-sm font-medium">نوشتن ژورنال</span>
            </div>
            <div className="p-4 bg-slate-700 rounded-2xl hover:bg-slate-600 transition-colors cursor-pointer">
              <span className="text-2xl block mb-1">✅</span>
              <span className="text-sm font-medium">بررسی عادت‌ها</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
