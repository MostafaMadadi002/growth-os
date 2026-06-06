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
  durationMonths: number;
  startDate: string;
  selectedDays?: number[]; // 0-6 (Sun-Sat)
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  type: 'POSITIVE' | 'NEGATIVE';
  streak: number;
  lastCheck?: string;
}

export interface StudentActivity {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  duration: number; // minutes
  sessions: number;
  type: 'POSITIVE' | 'NEGATIVE';
  goalId?: string;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  count: number;
  score: number; // cumulative score for heat map coloring
}

export interface ScheduleTask {
  id: string;
  label: string;
  time: string;
  dueDate?: string;
  goalId?: string;
  done: boolean;
}

export interface Trade {
  id: string;
  symbol: string;
  entry: number;
  exit?: number;
  status: 'OPEN' | 'CLOSED';
}

export interface TraderNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface AppState {
  currentRoot: UserRole;
  language: 'FA' | 'EN';
  
  studentData: {
    goals: Goal[];
    habits: Habit[];
    tasks: ScheduleTask[];
    activities: StudentActivity[];
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
  logActivity: (date: string, type: 'POSITIVE' | 'NEGATIVE', count?: number) => void;
  recordActivity: (activity: StudentActivity) => void;
  addTask: (task: ScheduleTask) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRoot: UserRole.STUDENT,
      language: 'FA',
      
      studentData: {
        goals: [],
        habits: [],
        tasks: [],
        activities: [],
        activityLogs: [],
      },
      
      traderData: {
        trades: [],
        notes: [],
      },
      
      setRoot: (root) => set({ currentRoot: root }),
      setLanguage: (lang) => set({ language: lang }),
      
      addGoal: (goal) => set((state) => ({
        studentData: { ...state.studentData, goals: [...(state.studentData.goals || []), goal] }
      })),

      completeSession: (goalId) => set((state) => {
        const goals = (state.studentData.goals || []).map(g => 
          g.id === goalId ? { ...g, completedSessions: Math.min(g.completedSessions + 1, g.totalSessions) } : g
        );
        
        const today = new Date().toISOString().split('T')[0];
        const logs = [...(state.studentData.activityLogs || [])];
        const existingLogIndex = logs.findIndex(l => l.date === today);
        
        const scoreChange = 1;
        if (existingLogIndex > -1) {
          logs[existingLogIndex].count += 1;
          logs[existingLogIndex].score += scoreChange;
        } else {
          logs.push({ date: today, count: 1, score: scoreChange });
        }

        return {
          studentData: { ...state.studentData, goals, activityLogs: logs }
        };
      }),

      deleteGoal: (id) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          goals: (state.studentData.goals || []).filter(g => g.id !== id) 
        }
      })),
      
      addHabit: (habit) => set((state) => ({
        studentData: { ...state.studentData, habits: [...(state.studentData.habits || []), habit] }
      })),

      toggleHabit: (habitId) => set((state) => {
        const habits = (state.studentData.habits || []).map(h => {
          if (h.id === habitId) {
            const today = new Date().toISOString().split('T')[0];
            const isCompletedToday = h.lastCheck === today;
            
            // Log as minor activity
            const logs = [...(state.studentData.activityLogs || [])];
            const existingLogIndex = logs.findIndex(l => l.date === today);
            const scoreChange = h.type === 'POSITIVE' ? (isCompletedToday ? -1 : 1) : (isCompletedToday ? 1 : -1);
            
            const newLogs = [...logs];
            if (existingLogIndex > -1) {
              newLogs[existingLogIndex].score += scoreChange;
            } else {
              newLogs.push({ date: today, count: 1, score: scoreChange });
            }

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
          habits: (state.studentData.habits || []).filter(h => h.id !== id) 
        }
      })),

      logActivity: (date, type, count = 1) => set((state) => {
        const logs = [...(state.studentData.activityLogs || [])];
        const existingLogIndex = logs.findIndex(l => l.date === date);
        const scoreChange = type === 'POSITIVE' ? count : -count;
        
        if (existingLogIndex > -1) {
          logs[existingLogIndex].count += count;
          logs[existingLogIndex].score += scoreChange;
        } else {
          logs.push({ date, count, score: scoreChange });
        }
        return { studentData: { ...state.studentData, activityLogs: logs } };
      }),

      recordActivity: (activity) => set((state) => {
        const logs = [...(state.studentData.activityLogs || [])];
        const existingLogIndex = logs.findIndex(l => l.date === activity.date);
        const scoreChange = activity.type === 'POSITIVE' ? activity.sessions : -activity.sessions;

        if (existingLogIndex > -1) {
          logs[existingLogIndex].count += activity.sessions;
          logs[existingLogIndex].score += scoreChange;
        } else {
          logs.push({ date: activity.date, count: activity.sessions, score: scoreChange });
        }

        // If it's a goal activity, update goal sessions
        let goals = [...state.studentData.goals];
        if (activity.goalId) {
          goals = goals.map(g => g.id === activity.goalId ? { ...g, completedSessions: g.completedSessions + activity.sessions } : g);
        }

        return {
          studentData: {
            ...state.studentData,
            activities: [...(state.studentData.activities || []), activity],
            activityLogs: logs,
            goals
          }
        };
      }),

      addTask: (task) => set((state) => ({
        studentData: {
          ...state.studentData,
          tasks: [...(state.studentData.tasks || []), task]
        }
      })),

      toggleTask: (taskId) => set((state) => {
        let updatedGoals = [...(state.studentData.goals || [])];
        const tasks = (state.studentData.tasks || []).map(t => {
          if (t.id === taskId) {
            const nowDone = !t.done;
            
            // If task is linked to a goal and marked as done, update goal progress
            if (nowDone && t.goalId) {
              updatedGoals = updatedGoals.map(g => 
                g.id === t.goalId ? { ...g, completedSessions: Math.min(g.completedSessions + 1, g.totalSessions) } : g
              );
            } else if (!nowDone && t.goalId) {
                // Optionally decrement if undone? Usually conservative to keep it
            }

            return { ...t, done: nowDone };
          }
          return t;
        });

        // Also log activity if marked as done today
        const today = new Date().toISOString().split('T')[0];
        const logs = [...(state.studentData.activityLogs || [])];
        const existingLogIndex = logs.findIndex(l => l.date === today);
        if (existingLogIndex > -1) {
          logs[existingLogIndex].count += 1;
        } else {
          logs.push({ date: today, count: 1 });
        }

        return { 
          studentData: { 
            ...state.studentData, 
            tasks, 
            goals: updatedGoals,
            activityLogs: logs 
          } 
        };
      }),

      deleteTask: (id) => set((state) => ({
        studentData: {
          ...state.studentData,
          tasks: (state.studentData.tasks || []).filter(t => t.id !== id)
        }
      })),

      addTraderTrade: (trade) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: [...(state.traderData.trades || []), trade],
        }
      })),

      deleteTraderTrade: (id) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: (state.traderData.trades || []).filter(t => t.id !== id),
        }
      })),
      
      addTraderNote: (note) => set((state) => ({
        traderData: { ...state.traderData, notes: [...(state.traderData.notes || []), note] }
      })),
    }),
    {
      name: 'growth-os-storage',
    }
  )
);
