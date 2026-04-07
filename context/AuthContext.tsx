'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { USERS, type User } from '@/data/seed';

export const AUTH_COOKIE_NAME = 'solvi_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const DEMO_ACCOUNTS = [
  { loginId: 'test_user', password: 'test123', userId: 'u1' },
  { loginId: 'expert_user', password: 'expert123', userId: 'u8' },
];

type AuthContextType = {
  isAuthenticated: boolean;
  currentUser: User;
  currentLoginId: string;
  login: (loginId: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const DEFAULT_USER = USERS.find((user) => user.id === 'u1') ?? USERS[0];
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEFAULT_LOGIN_ID = DEMO_ACCOUNTS.find((entry) => entry.userId === DEFAULT_USER.id)?.loginId ?? 'test_user';

function readSessionCookie() {
  if (typeof document === 'undefined') return false;
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_NAME}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
}

function setSessionCookie(value: string) {
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`;
}

function clearSessionCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => readSessionCookie());

  const login = async (loginId: string, password: string) => {
    const normalizedLogin = loginId.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const account = DEMO_ACCOUNTS.find(
      (entry) => entry.loginId === normalizedLogin && entry.password === normalizedPassword
    );

    if (!account) {
      return {
        ok: false,
        message: 'The login ID or password is incorrect.',
      };
    }

    setSessionCookie(account.userId);
    setSessionUserId(account.userId);

    return { ok: true };
  };

  const logout = () => {
    clearSessionCookie();
    setSessionUserId(null);
  };

  const currentUser = USERS.find((user) => user.id === sessionUserId) ?? DEFAULT_USER;
  const currentLoginId =
    DEMO_ACCOUNTS.find((entry) => entry.userId === currentUser.id)?.loginId ?? DEFAULT_LOGIN_ID;
  const isAuthenticated = Boolean(sessionUserId);

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentUser,
      currentLoginId,
      login,
      logout,
    }),
    [currentLoginId, currentUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
