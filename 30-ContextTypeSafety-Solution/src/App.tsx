// =============================================================================
// SOLUTION 30 — Context Type Safety
// =============================================================================
//
// Every change is annotated `// FIX #n`. `tsc --noEmit` now passes. The context
// carries a real type, and a `useUser()` guard hook turns the `User | null`
// context into a guaranteed non-null `User` for consumers (and throws clearly if
// used outside a provider).
// =============================================================================

import { createContext, useContext, type ReactNode } from 'react';

type User = { name: string; role: string };

// FIX #1: give the context a real type. `User | null` models "no provider yet";
//         the guard hook below removes the null for consumers.
const UserContext = createContext<User | null>(null);

function useUser(): User {
  const user = useContext(UserContext);
  if (user === null) {
    throw new Error('useUser must be used within a <UserContext.Provider>');
  }
  return user;
}

function Profile() {
  // `user` is a non-null User here, so these reads are safe.
  const user = useUser();
  return (
    <p>
      {user.name} — {user.role}
    </p>
  );
}

function UserProvider({ user, children }: { user: User; children: ReactNode }) {
  // FIX #2: the value is now `User`, which is assignable to `User | null`.
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Current user</h1>
      <UserProvider user={{ name: 'Ada', role: 'Engineer' }}>
        <Profile />
      </UserProvider>
    </main>
  );
}
