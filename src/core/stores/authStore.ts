import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { syncService } from '../services/syncService';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  init: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, isLoading: false });

      if (session?.user) {
        await syncService.syncToCloud(session.user.id);
      }

      // Listen for changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ session, user: session?.user ?? null });
        
        if (event === 'SIGNED_IN' && session?.user) {
          await syncService.syncToCloud(session.user.id);
        }
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  }
}));
