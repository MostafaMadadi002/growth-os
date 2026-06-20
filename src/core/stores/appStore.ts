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
  habitId?: string;
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
  taskId?: string;
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

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  linkedId?: string; // goalId or tradeId
  linkedType?: 'GOAL' | 'TRADE';
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
    notes: Note[];
  };
  
  traderData: {
    trades: Trade[];
    notes: Note[];
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
  deleteActivity: (activityId: string) => void;

  // Trader Actions
  addTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: string) => void;
  updateTrade: (trade: Trade) => void;
  
  // Note Actions
  addNote: (note: Note, domain: 'STUDENT' | 'TRADER') => void;
  deleteNote: (noteId: string, domain: 'STUDENT' | 'TRADER') => void;
  updateNote: (note: Note, domain: 'STUDENT' | 'TRADER') => void;
  
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
        notes: [],
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

      deleteGoal: (id) => set((state) => {
        const studentData = state.studentData;
        if (!studentData) return state;

        const goals = (studentData.goals || []).filter(g => g.id !== id);
        
        // Revert ALL historical progress points associated with this goal to keep heatmap and total score fully synchronized.
        const goalActivities = (studentData.activities || []).filter(a => a.goalId === id);
        const remainingActivities = (studentData.activities || []).filter(a => a.goalId !== id);
        
        const logs = [...(studentData.activityLogs || [])];
        
        goalActivities.forEach(activity => {
          const logIdx = logs.findIndex(l => l.date === activity.date);
          if (logIdx > -1) {
            const currentLog = logs[logIdx];
            const sessionsCount = Number(activity.sessions) || 0;
            const scoreChange = activity.type === 'POSITIVE' ? -sessionsCount : sessionsCount;
            
            const newPos = activity.type === 'POSITIVE' ? Math.max(0, (currentLog.posCount || 0) - sessionsCount) : (currentLog.posCount || 0);
            const newNeg = activity.type === 'NEGATIVE' ? Math.max(0, (currentLog.negCount || 0) - sessionsCount) : (currentLog.negCount || 0);

            logs[logIdx] = {
              ...currentLog,
              count: Math.max(0, currentLog.count - sessionsCount),
              score: currentLog.score + scoreChange,
              posCount: newPos,
              negCount: newNeg
            };
          }
        });

        return {
          studentData: {
            ...studentData,
            goals,
            activities: remainingActivities,
            activityLogs: logs
          }
        };
      }),

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
              const currentLog = newLogs[existingLogIndex];
              const newPos = h.type === 'POSITIVE' ? Math.max(0, (currentLog.posCount || 0) + (isCompletedToday ? -1 : 1)) : (currentLog.posCount || 0);
              const newNeg = h.type === 'NEGATIVE' ? Math.max(0, (currentLog.negCount || 0) + (isCompletedToday ? -1 : 1)) : (currentLog.negCount || 0);
              
              newLogs[existingLogIndex] = {
                ...currentLog,
                score: currentLog.score + scoreChange,
                posCount: newPos,
                negCount: newNeg,
                count: newPos + newNeg
              };
            } else {
              const pos = h.type === 'POSITIVE' ? 1 : 0;
              const neg = h.type === 'NEGATIVE' ? 1 : 0;
              newLogs.push({ date: today, count: 1, posCount: pos, negCount: neg, score: scoreChange });
            }
            updatedLogs = newLogs;

            let newStreak = h.streak;
            if (isCompletedToday) {
              newStreak = Math.max(0, h.streak - 1);
            } else {
              if (!h.lastCheck) {
                newStreak = 1;
              } else {
                const lastDate = new Date(h.lastCheck);
                const currDate = new Date(today);
                const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) newStreak += 1;
                else if (diffDays > 1) newStreak = 1;
                else if (diffDays === 0) { /* Already 1 or more, don't change */ }
              }
            }

            return {
              ...h,
              streak: newStreak,
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
          const currentLog = logs[existingLogIndex];
          const newPos = type === 'POSITIVE' ? (currentLog.posCount || 0) + count : (currentLog.posCount || 0);
          const newNeg = type === 'NEGATIVE' ? (currentLog.negCount || 0) + count : (currentLog.negCount || 0);
          
          logs[existingLogIndex] = {
            ...currentLog,
            count: currentLog.count + count,
            score: currentLog.score + scoreChange,
            posCount: newPos,
            negCount: newNeg
          };
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
          const currentLog = logs[existingLogIndex];
          const newPos = activity.type === 'POSITIVE' ? (currentLog.posCount || 0) + activity.sessions : (currentLog.posCount || 0);
          const newNeg = activity.type === 'NEGATIVE' ? (currentLog.negCount || 0) + activity.sessions : (currentLog.negCount || 0);
          
          logs[existingLogIndex] = {
            ...currentLog,
            count: currentLog.count + activity.sessions,
            score: currentLog.score + scoreChange,
            posCount: newPos,
            negCount: newNeg
          };
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
        const goal = activity.goalId ? studentData.goals.find(g => g.id === activity.goalId) : null;
        const targetHabitId = goal?.habitId;
        
        const existingHabit = targetHabitId 
          ? updatedHabits.find(h => h.id === targetHabitId)
          : updatedHabits.find(h => h.title === (goal?.title || activity.title) && h.type === activity.type);
        
        if (existingHabit) {
          updatedHabits = updatedHabits.map(h => {
            if (h.id === existingHabit.id) {
              let newStreak = h.streak;
              if (!h.lastCheck) {
                newStreak = 1;
              } else if (h.lastCheck === activity.date) {
                // Done today already
              } else {
                const lastDate = new Date(h.lastCheck);
                const currDate = new Date(activity.date);
                const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                  newStreak += 1;
                } else if (diffDays > 1) {
                  newStreak = 1;
                }
              }
              return { ...h, streak: newStreak, lastCheck: activity.date };
            }
            return h;
          });
        } else if (goal?.title || activity.title) {
          updatedHabits.push({
            id: Math.random().toString(36).substr(2, 9),
            title: goal?.title || activity.title,
            type: activity.type,
            streak: 1,
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
                goalId: t.goalId,
                taskId: t.id
              });

              // Add to Logs
              if (logIndex > -1) {
                const currentLog = logs[logIndex];
                logs[logIndex] = {
                  ...currentLog,
                  count: currentLog.count + 1,
                  score: currentLog.score + 1,
                  posCount: (currentLog.posCount || 0) + 1
                };
              } else {
                logs.push({ date: today, count: 1, posCount: 1, negCount: 0, score: 1 });
              }

              if (t.goalId) {
                const goal = updatedGoals.find(g => g.id === t.goalId);
                if (goal) {
                  updatedGoals = updatedGoals.map(g => 
                    g.id === t.goalId ? { ...g, completedSessions: Math.min(g.completedSessions + 1, g.totalSessions) } : g
                  );

                  // Sync with linked habit
                  if (goal.habitId) {
                    updatedHabits = updatedHabits.map(h => {
                      if (h.id === goal.habitId) {
                        let newStreak = h.streak;
                        if (!h.lastCheck) {
                          newStreak = 1;
                        } else if (h.lastCheck === today) {
                          // Already done today
                        } else {
                          const lastDate = new Date(h.lastCheck);
                          const currDate = new Date(today);
                          const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
                          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays === 1) newStreak += 1;
                          else if (diffDays > 1) newStreak = 1;
                        }
                        return { ...h, streak: newStreak, lastCheck: today };
                      }
                      return h;
                    });
                  }
                }
              }
            } else {
              // Undo Activity
              updatedActivities = updatedActivities.filter(a => a.taskId !== t.id);
              
              // Subtract from Logs
              if (logIndex > -1) {
                const currentLog = logs[logIndex];
                logs[logIndex] = {
                  ...currentLog,
                  count: Math.max(0, currentLog.count - 1),
                  score: currentLog.score - 1,
                  posCount: Math.max(0, (currentLog.posCount || 0) - 1)
                };
              }

              if (t.goalId) {
                const goal = updatedGoals.find(g => g.id === t.goalId);
                if (goal) {
                  updatedGoals = updatedGoals.map(g => 
                    g.id === t.goalId ? { ...g, completedSessions: Math.max(g.completedSessions - 1, 0) } : g
                  );

                  // Revert linked habit
                  if (goal.habitId) {
                    updatedHabits = updatedHabits.map(h => 
                      h.id === goal.habitId ? { ...h, streak: Math.max(0, h.streak - 1) } : h
                    );
                  }
                }
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

      deleteTask: (id) => set((state) => {
        const studentData = state.studentData;
        if (!studentData) return state;
        
        const task = (studentData.tasks || []).find(t => t.id === id);
        if (!task) return state;

        const tasks = studentData.tasks.filter(t => t.id !== id);
        const today = new Date().toISOString().split('T')[0];
        const logs = [...(studentData.activityLogs || [])];
        let updatedGoals = [...(studentData.goals || [])];
        let updatedActivities = [...(studentData.activities || [])];

        if (task.done) {
          const logIndex = logs.findIndex(l => l.date === today);
          if (logIndex > -1) {
            const currentLog = logs[logIndex];
            logs[logIndex] = {
              ...currentLog,
              count: Math.max(0, currentLog.count - 1),
              score: currentLog.score - 1,
              posCount: Math.max(0, (currentLog.posCount || 0) - 1)
            };
          }
          
          if (task.goalId) {
            updatedGoals = updatedGoals.map(g => 
              g.id === task.goalId ? { ...g, completedSessions: Math.max(0, g.completedSessions - 1) } : g
            );
          }
          
          // Remove associated activity from timeline
          updatedActivities = updatedActivities.filter(a => a.taskId !== task.id);
        }

        return {
          studentData: {
            ...studentData,
            tasks,
            activityLogs: logs,
            goals: updatedGoals,
            activities: updatedActivities
          }
        };
      }),

      deleteActivity: (id) => set((state) => {
        const studentData = state.studentData;
        const activitiesList = studentData.activities || [];
        const activity = activitiesList.find(a => a.id === id);
        if (!activity) return state;

        const activities = activitiesList.filter(a => a.id !== id);
        
        const logs = [...(studentData.activityLogs || [])];
        const logIndex = logs.findIndex(l => l.date === activity.date);
        const scoreChange = activity.type === 'POSITIVE' ? -activity.sessions : activity.sessions;

        if (logIndex > -1) {
          const currentLog = logs[logIndex];
          const newPos = activity.type === 'POSITIVE' ? Math.max(0, (currentLog.posCount || 0) - activity.sessions) : (currentLog.posCount || 0);
          const newNeg = activity.type === 'NEGATIVE' ? Math.max(0, (currentLog.negCount || 0) - activity.sessions) : (currentLog.negCount || 0);
          
          logs[logIndex] = {
            ...currentLog,
            count: Math.max(0, currentLog.count - activity.sessions),
            score: currentLog.score + scoreChange,
            posCount: newPos,
            negCount: newNeg
          };
        }

        let goals = [...(studentData.goals || [])];
        let habits = [...(studentData.habits || [])];
        if (activity.goalId) {
          const goal = goals.find(g => g.id === activity.goalId);
          goals = goals.map(g => g.id === activity.goalId ? { ...g, completedSessions: Math.max(0, g.completedSessions - activity.sessions) } : g);
          
          if (goal?.habitId) {
            habits = habits.map(h => 
              h.id === goal.habitId ? { ...h, streak: Math.max(0, h.streak - 1) } : h
            );
          }
        }

        let tasks = [...(studentData.tasks || [])];
        if (activity.taskId) {
          tasks = tasks.map(t => t.id === activity.taskId ? { ...t, done: false } : t);
        }

        return {
          studentData: {
            ...studentData,
            activities,
            activityLogs: logs,
            goals,
            habits,
            tasks
          }
        };
      }),

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
      
      addNote: (note, domain) => set((state) => {
        const key = domain === 'STUDENT' ? 'studentData' : 'traderData';
        return {
          [key]: {
            ...state[key],
            notes: [...(state[key].notes || []), note]
          }
        };
      }),

      deleteNote: (id, domain) => set((state) => {
        const key = domain === 'STUDENT' ? 'studentData' : 'traderData';
        return {
          [key]: {
            ...state[key],
            notes: (state[key].notes || []).filter((n: Note) => n.id !== id)
          }
        };
      }),

      updateNote: (note, domain) => set((state) => {
        const key = domain === 'STUDENT' ? 'studentData' : 'traderData';
        return {
          [key]: {
            ...state[key],
            notes: (state[key].notes || []).map((n: Note) => n.id === note.id ? note : n)
          }
        };
      }),
    }),
    {
      name: 'growth-os-storage',
    }
  )
);
