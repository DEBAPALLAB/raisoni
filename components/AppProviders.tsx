'use client';

import { AuthProvider } from '@/context/AuthContext';
import { TokenProvider } from '@/context/TokenContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TokenProvider>{children}</TokenProvider>
    </AuthProvider>
  );
}
