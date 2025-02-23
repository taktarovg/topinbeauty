// src/providers/ServerAuthProvider.tsx
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session';
import { ReactNode } from 'react'; // Импортируем ReactNode

export default async function ServerAuthProvider({ children }: { children: ReactNode }) {
  const session = await getSession({ cookies: cookies() });

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}