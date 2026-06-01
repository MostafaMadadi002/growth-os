import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Book, CheckCircle, Target, TrendingUp, FileText } from 'lucide-react-native';

import DashboardScreen from '../../features/dashboard/DashboardScreen';
import JournalScreen from '../../features/journal/JournalScreen';
import HabitsScreen from '../../features/habits/HabitsScreen';
import GoalsScreen from '../../features/goals/GoalsScreen';
import TradingScreen from '../../features/trading/TradingScreen';
import NotesScreen from '../../features/notes/NotesScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a', // slate-900
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#10b981', // emerald-500
        tabBarInactiveTintColor: '#64748b', // slate-500
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen} 
        options={{ tabBarIcon: ({ color }) => <Book color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Habits" 
        component={HabitsScreen} 
        options={{ tabBarIcon: ({ color }) => <CheckCircle color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen} 
        options={{ tabBarIcon: ({ color }) => <Target color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Trading" 
        component={TradingScreen} 
        options={{ tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen} 
        options={{ tabBarIcon: ({ color }) => <FileText color={color} size={24} /> }}
      />
    </Tab.Navigator>
  );
}
