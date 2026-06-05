import { create } from 'zustand';

export enum UserRole {
  STUDENT = 'STUDENT',
  TRADER = 'TRADER',
}

interface AppState {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  // Node-based Storage
  rootData: {
    [UserRole.STUDENT]: {
      goals: any[];
      habits: any[];
      notes: any[];
    };
    [UserRole.TRADER]: {
      journal: any[];
      notes: any[];
    };
  };
}

export const useAppStore = create<AppState>((set) => ({
  activeRole: UserRole.STUDENT,
  setActiveRole: (role) => set({ activeRole: role }),
  rootData: {
    [UserRole.STUDENT]: { goals: [], habits: [], notes: [] },
    [UserRole.TRADER]: { journal: [], notes: [] },
  },
}));
