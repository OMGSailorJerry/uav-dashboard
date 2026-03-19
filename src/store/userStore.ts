/**
 * User authentication and session store
 * Manages current user state and authentication actions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/domain/types';

interface UserStore {
  currentUser: User | null;
  
  /**
   * Authenticates a user with the given role
   * TODO: Replace with real authentication service call
   */
  login: (role: UserRole, name?: string) => void;
  
  /**
   * Logs out the current user and clears session
   */
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,

      login: (role: UserRole, name?: string) => {
        // TODO: Replace mock login with real auth service
        const user: User = {
          id: `user-${role}-1`,
          role,
          name: name || (role === 'coordinator' ? 'Coordinator User' : 'Operator User'),
        };
        set({ currentUser: user });
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
