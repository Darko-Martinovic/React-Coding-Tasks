// =============================================================================
// TASK 30 — Context Type Safety
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: type-check (COMPILE-BY-DESIGN — making `tsc` pass IS the exercise)
//
// IMPORTANT: Vite does NOT type-check; `npm run dev` may appear to work. See the
// real errors with:
//
//     npm run typecheck      (i.e. tsc --noEmit)
//
// GOAL: Fix the types so `tsc --noEmit` reports ZERO errors, WITHOUT `any` / `!`
//       / `as`. TWO distinct type bugs that both stem from an untyped context.
//
// THINGS TO SCRUTINISE:
//   1. `createContext(null)` is inferred as `Context<null>`. So consumers get
//      `null`, and reading `user.name` / `user.role` is a type error. Give the
//      context a real type.
//   2. Because the context type is `null`, the <Provider value={{...}}> below is
//      also an error (an object is not assignable to `null`). The right type
//      makes BOTH the provider and the consumer type-check.
//   (Idiomatic pattern: type the value as `User | null` (or `undefined`) and add
//   a `useUser()` guard hook that throws when used outside the provider, so
//   consumers receive a non-null `User`.)
// =============================================================================

import { createContext, useContext } from 'react';

// BUG #1: inferred as Context<null>.
const UserContext = createContext(null);

function Profile() {
  const user = useContext(UserContext);
  // BUG #1 (cont.): `user` is `null`, so these property reads do not type-check.
  return (
    <p>
      {user.name} — {user.role}
    </p>
  );
}

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Current user</h1>
      {/* BUG #2: an object is not assignable to `null`. */}
      <UserContext.Provider value={{ name: 'Ada', role: 'Engineer' }}>
        <Profile />
      </UserContext.Provider>
    </main>
  );
}
