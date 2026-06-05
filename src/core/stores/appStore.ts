import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum UserRole {
  STUDENT = 'STUDENT',
  TRADER = 'TRADER',
}

export interface Goal {
  id: string;
  title: string;
  totalSessions: number;
  completedSessions: number;
  frequencyPerWeek: number;
  category: 'STUDY' | 'WORK' | 'PROJECT';
}

export interface Habit {
  id: string;
  title: string;
  type: 'POSITIVE' | 'NEGATIVE';
  streak: number;
  lastCheck?: string;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  count: number;
}

interface AppState {
  currentRoot: UserRole;
  language: 'FA' | 'EN';
  
  studentData: {
    goals: Goal[];
    habits: Habit[];
    activityLogs: ActivityLog[];
  };
  
  traderData: {
    trades: Trade[];
    notes: TraderNote[];
  };
  
  setRoot: (root: UserRole) => void;
  setLanguage: (lang: 'FA' | 'EN') => void;
  
  // Student Actions
  addGoal: (goal: Goal) => void;
  completeSession: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
  addHabit: (habit: Habit) => void;
  toggleHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRoot: UserRole.STUDENT,
      language: 'FA',
      
      studentData: {
        goals: [],
        habits: [],
        activityLogs: [],
      },
      
      traderData: {
        trades: [],
        notes: [],
      },
      
      setRoot: (root) => set({ currentRoot: root }),
      setLanguage: (lang) => set({ language: lang }),
      
      addGoal: (goal) => set((state) => ({
        studentData: { ...state.studentData, goals: [...state.studentData.goals, goal] }
      })),

      completeSession: (goalId) => set((state) => {
        const goals = state.studentData.goals.map(g => 
          g.id === goalId ? { ...g, completedSessions: Math.min(g.completedSessions + 1, g.totalSessions) } : g
        );
        
        const today = new Date().toISOString().split('T')[0];
        const logs = [...state.studentData.activityLogs];
        const existingLogIndex = logs.findIndex(l => l.date === today);
        
        if (existingLogIndex > -1) {
          logs[existingLogIndex].count += 1;
        } else {
          logs.push({ date: today, count: 1 });
        }

        return {
          studentData: { ...state.studentData, goals, activityLogs: logs }
        };
      }),

      deleteGoal: (id) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          goals: state.studentData.goals.filter(g => g.id !== id) 
        }
      })),
      
      addHabit: (habit) => set((state) => ({
        studentData: { ...state.studentData, habits: [...state.studentData.habits, habit] }
      })),

      toggleHabit: (habitId) => set((state) => {
        const habits = state.studentData.habits.map(h => {
          if (h.id === habitId) {
            const today = new Date().toISOString().split('T')[0];
            const isCompletedToday = h.lastCheck === today;
            return {
              ...h,
              streak: isCompletedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
              lastCheck: isCompletedToday ? undefined : today
            };
          }
          return h;
        });
        return { studentData: { ...state.studentData, habits } };
      }),

      deleteHabit: (id) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          habits: state.studentData.habits.filter(h => h.id !== id) 
        }
      })),

      addTraderTrade: (trade) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: [...state.traderData.trades, trade],
        }
      })),

      deleteTraderTrade: (id) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: state.traderData.trades.filter(t => t.id !== id),
        }
      })),
      
      addTraderNote: (note) => set((state) => ({
        traderData: { ...state.traderData, notes: [...state.traderData.notes, note] }
      })),
    }),
    {
      name: 'growth-os-storage',
    }
  )
);
