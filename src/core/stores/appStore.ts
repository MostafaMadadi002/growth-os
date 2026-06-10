import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum UserRole {
  STUDENT = 'STUDENT',
  TRADER = 'TRADER',
}

export interface SubGoal {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  totalSessions: number;
  completedSessions: number;
  frequencyPerWeek: number;
  category: 'STUDY' | 'WORK' | 'PROJECT';
  duration: number;
  durationUnit: 'DAYS' | 'WEEKS' | 'MONTHS';
  startDate: string;
  selectedDays?: number[]; // 0-6 (Sun-Sat)
  subGoals?: SubGoal[];
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
  time?: string; // HH:mm
  title: string;
  duration: number; // minutes
  sessions: number;
  type: 'POSITIVE' | 'NEGATIVE';
  goalId?: string;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  count: number;
  posCount: number;
  negCount: number;
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
  marketType: 'FOREX' | 'CRYPTO';
  symbol: string;
  date: string;
  positionType: 'BUY' | 'SELL';
  size: number; // lot for Forex, margin for Crypto
  riskReward: number;
  fee: number; // spread for Forex, commission for Crypto
  entry: number;
  stopLoss: number;
  target: number;
  result: 'WIN' | 'LOSS' | 'BE' | 'PENDING';
  profitAmount: number;
  notes?: string;
  labels?: string[];
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
  theme: 'DARK' | 'LIGHT';
  
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
  
  notificationsEnabled: boolean;
  
  setRoot: (root: UserRole) => void;
  setLanguage: (lang: 'FA' | 'EN') => void;
  setTheme: (theme: 'DARK' | 'LIGHT') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  
  // Student Actions
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  toggleSubGoal: (goalId: string, subGoalId: string) => void;
  addHabit: (habit: Habit) => void;
  toggleHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  logActivity: (date: string, type: 'POSITIVE' | 'NEGATIVE', count?: number) => void;
  recordActivity: (activity: StudentActivity) => void;
  addTask: (task: ScheduleTask) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  // Trader Actions
  addTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: string) => void;
  updateTrade: (trade: Trade) => void;
  addTraderNote: (note: TraderNote) => void;
  importData: (data: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRoot: UserRole.STUDENT,
      language: 'FA',
      theme: 'DARK',
      
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
      
      notificationsEnabled: false,
      
      setRoot: (root) => set({ currentRoot: root }),
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      importData: (data) => set((state) => ({
        ...state,
        studentData: data.studentData || state.studentData,
        traderData: data.traderData || state.traderData,
      })),
      
      addGoal: (goal) => set((state) => ({
        studentData: { ...state.studentData, goals: [...(state.studentData.goals || []), goal] }
      })),

      updateGoal: (goal) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          goals: (state.studentData.goals || []).map(g => g.id === goal.id ? goal : g) 
        }
      })),

      deleteGoal: (id) => set((state) => ({
        studentData: { 
          ...state.studentData, 
          goals: (state.studentData.goals || []).filter(g => g.id !== id) 
        }
      })),

      toggleSubGoal: (goalId, subGoalId) => set((state) => ({
        studentData: {
          ...state.studentData,
          goals: (state.studentData.goals || []).map(g => {
            if (g.id === goalId) {
              return {
                ...g,
                subGoals: (g.subGoals || []).map(sg => sg.id === subGoalId ? { ...sg, done: !sg.done } : sg)
              };
            }
            return g;
          })
        }
      })),
      
      addHabit: (habit) => set((state) => ({
        studentData: { ...state.studentData, habits: [...(state.studentData.habits || []), habit] }
      })),

      toggleHabit: (habitId) => set((state) => {
        const logs = [...(state.studentData.activityLogs || [])];
        let updatedLogs = logs;
        
        const habits = (state.studentData.habits || []).map(h => {
          if (h.id === habitId) {
            const today = new Date().toISOString().split('T')[0];
            const isCompletedToday = h.lastCheck === today;
            
            // Log as minor activity
            const existingLogIndex = logs.findIndex(l => l.date === today);
            const scoreChange = h.type === 'POSITIVE' ? (isCompletedToday ? -1 : 1) : (isCompletedToday ? 1 : -1);
            
            const newLogs = [...logs];
            if (existingLogIndex > -1) {
              newLogs[existingLogIndex].score += scoreChange;
              if (h.type === 'POSITIVE') {
                newLogs[existingLogIndex].posCount = Math.max(0, (newLogs[existingLogIndex].posCount || 0) + (isCompletedToday ? -1 : 1));
              } else {
                newLogs[existingLogIndex].negCount = Math.max(0, (newLogs[existingLogIndex].negCount || 0) + (isCompletedToday ? -1 : 1));
              }
              newLogs[existingLogIndex].count = (newLogs[existingLogIndex].posCount || 0) + (newLogs[existingLogIndex].negCount || 0);
            } else {
              const pos = h.type === 'POSITIVE' ? 1 : 0;
              const neg = h.type === 'NEGATIVE' ? 1 : 0;
              newLogs.push({ date: today, count: 1, posCount: pos, negCount: neg, score: scoreChange });
            }
            updatedLogs = newLogs;

            return {
              ...h,
              streak: isCompletedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
              lastCheck: isCompletedToday ? undefined : today
            };
          }
          return h;
        });
        return { 
          studentData: { 
            ...state.studentData, 
            habits,
            activityLogs: updatedLogs
          } 
        };
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
          if (type === 'POSITIVE') logs[existingLogIndex].posCount = (logs[existingLogIndex].posCount || 0) + count;
          else logs[existingLogIndex].negCount = (logs[existingLogIndex].negCount || 0) + count;
        } else {
          logs.push({ 
            date, 
            count, 
            posCount: type === 'POSITIVE' ? count : 0, 
            negCount: type === 'NEGATIVE' ? count : 0, 
            score: scoreChange 
          });
        }
        return { studentData: { ...state.studentData, activityLogs: logs } };
      }),

      recordActivity: (activity) => set((state) => {
        const studentData = state.studentData;
        const logs = [...(studentData.activityLogs || [])];
        const existingLogIndex = logs.findIndex(l => l.date === activity.date);
        const scoreChange = activity.type === 'POSITIVE' ? activity.sessions : -activity.sessions;

        if (existingLogIndex > -1) {
          logs[existingLogIndex].count += activity.sessions;
          logs[existingLogIndex].score += scoreChange;
          if (activity.type === 'POSITIVE') logs[existingLogIndex].posCount = (logs[existingLogIndex].posCount || 0) + activity.sessions;
          else logs[existingLogIndex].negCount = (logs[existingLogIndex].negCount || 0) + activity.sessions;
        } else {
          logs.push({ 
            date: activity.date, 
            count: activity.sessions, 
            posCount: activity.type === 'POSITIVE' ? activity.sessions : 0, 
            negCount: activity.type === 'NEGATIVE' ? activity.sessions : 0, 
            score: scoreChange 
          });
        }

        // Auto-sync with Habits
        let updatedHabits = [...(studentData.habits || [])];
        const habitTitle = activity.goalId 
          ? (studentData.goals.find(g => g.id === activity.goalId)?.title || activity.title)
          : activity.title;
        
        const existingHabit = updatedHabits.find(h => h.title === habitTitle && h.type === activity.type);
        
        if (existingHabit) {
          updatedHabits = updatedHabits.map(h => 
            h.id === existingHabit.id 
              ? { ...h, streak: h.streak + activity.sessions, lastCheck: activity.date } 
              : h
          );
        } else {
          updatedHabits.push({
            id: Math.random().toString(36).substr(2, 9),
            title: habitTitle,
            type: activity.type,
            streak: activity.sessions,
            lastCheck: activity.date
          });
        }

        // If it's a goal activity, update goal sessions
        let goals = [...studentData.goals];
        if (activity.goalId) {
          goals = goals.map(g => g.id === activity.goalId ? { ...g, completedSessions: g.completedSessions + activity.sessions } : g);
        }

        return {
          studentData: {
            ...studentData,
            activities: [...(studentData.activities || []), activity],
            activityLogs: logs,
            habits: updatedHabits,
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
        const studentData = state.studentData;
        let updatedGoals = [...(studentData.goals || [])];
        let updatedHabits = [...(studentData.habits || [])];
        let updatedActivities = [...(studentData.activities || [])];
        const today = new Date().toISOString().split('T')[0];
        const logs = [...(studentData.activityLogs || [])];

        const tasks = (studentData.tasks || []).map(t => {
          if (t.id === taskId) {
            const nowDone = !t.done;
            const logIndex = logs.findIndex(l => l.date === today);
            
            if (nowDone) {
              // Record as Activity
              const activityId = Math.random().toString(36).substr(2, 9);
              updatedActivities.push({
                id: activityId,
                date: today,
                title: t.label,
                duration: 60,
                sessions: 1,
                type: 'POSITIVE',
                goalId: t.goalId
              });

              // Add to Logs
              if (logIndex > -1) {
                logs[logIndex].count += 1;
                logs[logIndex].score += 1;
                logs[logIndex].posCount = (logs[logIndex].posCount || 0) + 1;
              } else {
                logs.push({ date: today, count: 1, posCount: 1, negCount: 0, score: 1 });
              }

              if (t.goalId) {
                updatedGoals = updatedGoals.map(g => 
                  g.id === t.goalId ? { ...g, completedSessions: Math.min(g.completedSessions + 1, g.totalSessions) } : g
                );
              }
            } else {
              // Undo Activity
              updatedActivities = updatedActivities.filter(a => a.title !== t.label || a.date !== today);
              
              // Subtract from Logs
              if (logIndex > -1) {
                logs[logIndex].count = Math.max(0, logs[logIndex].count - 1);
                logs[logIndex].score -= 1;
                logs[logIndex].posCount = Math.max(0, (logs[logIndex].posCount || 0) - 1);
              }

              if (t.goalId) {
                updatedGoals = updatedGoals.map(g => 
                  g.id === t.goalId ? { ...g, completedSessions: Math.max(g.completedSessions - 1, 0) } : g
                );
              }
            }

            return { ...t, done: nowDone };
          }
          return t;
        });

        return { 
          studentData: { 
            ...studentData, 
            tasks, 
            goals: updatedGoals,
            habits: updatedHabits,
            activities: updatedActivities,
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

      addTrade: (trade) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: [...(state.traderData.trades || []), trade],
        }
      })),

      deleteTrade: (id) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: (state.traderData.trades || []).filter(t => t.id !== id),
        }
      })),

      updateTrade: (trade) => set((state) => ({
        traderData: {
          ...state.traderData,
          trades: (state.traderData.trades || []).map(t => t.id === trade.id ? trade : t),
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
