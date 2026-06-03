import { create } from 'zustand';
import { LearningSession, Course } from '../../../core/types';
import { learningService } from '../services/learningService';
import { activityService } from '../../../core/services/activityService';

interface LearningState {
  sessions: LearningSession[];
  courses: Course[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
  addSession: (s: Omit<LearningSession, 'id' | 'user_id'>) => Promise<void>;
  addCourse: (c: Omit<Course, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  sessions: [],
  courses: [],
  isLoading: false,

  fetchData: async () => {
    set({ isLoading: true });
    // In a real app we'd fetch courses too
    const sessions = await learningService.getAll();
    set({ sessions, isLoading: false });
  },

  addSession: async (s) => {
    const session = await learningService.create(s);
    
    await activityService.logActivity(
      'CUSTOM', 
      'Learning', 
      session.id, 
      `Knowledge Acquired: ${session.title}`,
      { duration: session.duration_minutes, category: session.category }
    );

    set({ sessions: [session, ...get().sessions] });
  },

  addCourse: async (c) => {
    const course: Course = {
        ...c,
        id: Math.random().toString(36).substr(2, 9),
        user_id: '1',
        created_at: new Date().toISOString()
    };
    set({ courses: [course, ...get().courses] });
  }
}));
