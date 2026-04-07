'use client';

import { AuthProvider } from '@/context/AuthContext';
import { TokenProvider } from '@/context/TokenContext';
import { KnowledgeProvider } from '@/context/KnowledgeContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <KnowledgeProvider>
        <TokenProvider>{children}</TokenProvider>
      </KnowledgeProvider>
    </AuthProvider>
  );
}
