import { create } from 'zustand';
import { Workout } from '../../../core/types';
import { fitnessService } from '../services/fitnessService';

interface FitnessState {
  workouts: Workout[];
  isLoading: boolean;
  fetchWorkouts: () => Promise<void>;
  addWorkout: (w: Omit<Workout, 'id' | 'user_id'>) => Promise<void>;
}

export const useFitnessStore = create<FitnessState>((set, get) => ({
  workouts: [],
  isLoading: false,

  fetchWorkouts: async () => {
    set({ isLoading: true });
    const workouts = await fitnessService.getAllWorkouts();
    set({ workouts, isLoading: false });
  },

  addWorkout: async (w) => {
    const workout = await fitnessService.createWorkout(w);
    set({ workouts: [workout, ...get().workouts] });
  }
}));
