import React from 'react';
import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View 
      style={{ flex: 1 }} 
      className="items-center justify-center bg-slate-50 dark:bg-slate-900"
    >
      <View className="p-8 items-center bg-white dark:bg-slate-800 rounded-3xl shadow-xl">
        <Text className="text-3xl font-bold text-emerald-500 mb-2">GrowthOS</Text>
        <Text className="text-xl text-slate-600 dark:text-slate-300">به سیستم عامل رشد خوش آمدید</Text>
        <View className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
          <Text className="text-emerald-700 dark:text-emerald-400 font-medium">امروز برای رشد خود چه برنامه‌ای دارید؟</Text>
        </View>
      </View>
    </View>
  );
}
