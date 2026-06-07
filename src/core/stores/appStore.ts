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
            
            if (nowDone) {
              // Record as Activity if marked as done
              const activityId = Math.random().toString(36).substr(2, 9);
              const newActivity: StudentActivity = {
                id: activityId,
                date: today,
                title: t.label,
                duration: 60, // Default 1 hour
                sessions: 1,
                type: 'POSITIVE',
                goalId: t.goalId
              };
              updatedActivities.push(newActivity);

              // Update Logs
              const logIndex = logs.findIndex(l => l.date === today);
              if (logIndex > -1) {
                logs[logIndex].count += 1;
                logs[logIndex].score += 1;
                logs[logIndex].posCount = (logs[logIndex].posCount || 0) + 1;
              } else {
                logs.push({ date: today, count: 1, posCount: 1, negCount: 0, score: 1 });
              }

              // Update Goal
              if (t.goalId) {
                updatedGoals = updatedGoals.map(g => 
                  g.id === t.goalId ? { ...g, completedSessions: Math.min(g.completedSessions + 1, g.totalSessions) } : g
                );
              }

              // Update Habit
              const habitTitle = t.goalId 
                ? (updatedGoals.find(g => g.id === t.goalId)?.title || t.label)
                : t.label;
              const existingHabit = updatedHabits.find(h => h.title === habitTitle && h.type === 'POSITIVE');
              if (existingHabit) {
                updatedHabits = updatedHabits.map(h => h.id === existingHabit.id ? { ...h, streak: h.streak + 1, lastCheck: today } : h);
              } else {
                updatedHabits.push({ id: Math.random().toString(36).substr(2, 9), title: habitTitle, type: 'POSITIVE', streak: 1, lastCheck: today });
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
