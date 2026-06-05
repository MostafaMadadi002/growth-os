import { create } from 'zustand';

export enum UserRole {
  STUDENT = 'STUDENT',
  TRADER = 'TRADER',
  ATHLETE = 'ATHLETE',
}

interface AppState {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeRole: UserRole.STUDENT, // Default to Student
  setActiveRole: (role) => set({ activeRole: role }),
}));
