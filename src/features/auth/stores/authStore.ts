import { create } from 'zustand';
import type { User, LoginUser } from '@shared/types/user';
import { tokenStorage } from '@/lib/storage';
import { queryClient } from '@/lib/queryClient';
import { setSentryUser } from '@/lib/sentry';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  /** Called on login — stores tokens and a minimal user from the login response. */
  setAuth: (user: LoginUser, accessToken: string, refreshToken: string) => void;
  /** Called after getMe() — replaces user with full profile including role. */
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

function toUser(loginUser: LoginUser): User {
  return {
    ...loginUser,
    role: null,
    email_verified: loginUser.email_verified ?? false,
  };
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (loginUser, accessToken, refreshToken) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    setSentryUser(loginUser.id);
    set({ user: toUser(loginUser), isAuthenticated: true });
  },

  setUser: (user) => {
    setSentryUser(user.id);
    set({ user });
  },

  logout: () => {
    tokenStorage.clearAll();
    queryClient.clear();
    setSentryUser(null);
    set({ user: null, isAuthenticated: false });
  },

  setHydrated: () => {
    set({ isHydrated: true });
  },
}));
