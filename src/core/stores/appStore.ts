import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum UserRole {
  STUDENT = 'STUDENT',
  TRADER = 'TRADER',
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  progress: number;
}

export interface Habit {
  id: string;
  title: string;
  type: 'good' | 'bad';
  dailyTarget: number;
  weekLog: number[]; // e.g. [1, 0, 1, 1, 0, 0, 1]
}

export interface StudentNote {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export interface Trade {
  id: string;
  market: string;
  date: string;
  pnl_amount: number;
  note: string;
}

export interface TraderNote {
  id: string;
  symbol: string;
  content: string;
  date: string;
}

interface AppState {
  currentRoot: UserRole;
  language: 'FA' | 'EN';
  
  studentData: {
    goals: Goal[];
    habits: Habit[];
    notes: StudentNote[];
    dailyProgress: Record<string, number>; // Key: YYYY-MM-DD
  };
  
  traderData: {
    trades: Trade[];
    notes: TraderNote[];
    dailyOutcomes: Record<string, { pnl: number; count: number }>;
  };
  
  setRoot: (root: UserRole) => void;
  setLanguage: (lang: 'FA' | 'EN') => void;
  
  // Student Actions
  addStudentGoal: (goal: Goal) => void;
  deleteStudentGoal: (id: string) => void;
  updateStudentGoal: (id: string, progress: number) => void;
  addStudentHabit: (habit: Habit) => void;
  deleteStudentHabit: (id: string) => void;
  updateStudentHabit: (id: string, weekLog: number[]) => void;
  addStudentNote: (note: StudentNote) => void;
  logStudentActivity: (date: string) => void;

  // Trader Actions
  addTraderTrade: (trade: Trade) => void;
  deleteTraderTrade: (id: string) => void;
  addTraderNote: (note: TraderNote) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRoot: UserRole.STUDENT,
      language: 'FA',
      
      studentData: {
        goals: [],
        habits: [],
        notes: [],
        dailyProgress: {},
      },
      
      traderData: {
        trades: [],
        notes: [],
        dailyOutcomes: {},
      },
      
      setRoot: (root) => set({ currentRoot: root }),
      setLanguage: (lang) => set({ language: lang }),
      
      addStudentGoal: (goal) => set((state) => ({
        studentData: { ...state.studentData, goals: [...state.studentData.goals, goal] }
      })),

      deleteStudentGoal: (id) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          goals: state.studentData.goals.filter(g => g.id !== id) 
        }
      })),
      
      updateStudentGoal: (id, progress) => set((state) => ({
        studentData: {
          ...state.studentData,
          goals: state.studentData.goals.map(g => g.id === id ? { ...g, progress } : g)
        }
      })),
      
      addStudentHabit: (habit) => set((state) => ({
        studentData: { ...state.studentData, habits: [...state.studentData.habits, habit] }
      })),

      deleteStudentHabit: (id) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          habits: state.studentData.habits.filter(h => h.id !== id) 
        }
      })),
      
      updateStudentHabit: (id, weekLog) => set((state) => ({
        studentData: {
          ...state.studentData,
          habits: state.studentData.habits.map(h => h.id === id ? { ...h, weekLog } : h)
        }
      })),
      
      addStudentNote: (note) => set((state) => ({
        studentData: { ...state.studentData, notes: [...state.studentData.notes, note] }
      })),
      
      logStudentActivity: (date) => set((state) => ({
        studentData: {
          ...state.studentData,
          dailyProgress: {
            ...state.studentData.dailyProgress,
            [date]: (state.studentData.dailyProgress[date] || 0) + 1
          }
        }
      })),

      addTraderTrade: (trade) => set((state) => {
        const outcomes = { ...state.traderData.dailyOutcomes };
        const date = trade.date.split('T')[0];
        const current = outcomes[date] || { pnl: 0, count: 0 };
        outcomes[date] = { pnl: current.pnl + trade.pnl_amount, count: current.count + 1 };
        
        return {
          traderData: {
            ...state.traderData,
            trades: [...state.traderData.trades, trade],
            dailyOutcomes: outcomes
          }
        };
      }),

      deleteTraderTrade: (id) => set((state) => {
        const tradeToDelete = state.traderData.trades.find(t => t.id === id);
        if (!tradeToDelete) return state;

        const outcomes = { ...state.traderData.dailyOutcomes };
        const date = tradeToDelete.date.split('T')[0];
        const current = outcomes[date];
        if (current) {
          outcomes[date] = { 
            pnl: current.pnl - tradeToDelete.pnl_amount, 
            count: current.count - 1 
          };
          if (outcomes[date].count <= 0) delete outcomes[date];
        }

        return {
          traderData: {
            ...state.traderData,
            trades: state.traderData.trades.filter(t => t.id !== id),
            dailyOutcomes: outcomes
          }
        };
      }),
      
      addTraderNote: (note) => set((state) => ({
        traderData: { ...state.traderData, notes: [...state.traderData.notes, note] }
      })),
    }),
    {
      name: 'growth-os-storage',
    }
  )
);
