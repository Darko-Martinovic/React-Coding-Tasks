// =============================================================================
// TASK 19 — Suspense & lazy
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (CRASHES on render — check the console / error overlay)
//
// <Heavy> is code-split with React.lazy and a (faked) async import. It crashes
// for TWO independent reasons.
//
// GOAL: Render the lazy component. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. A lazy component SUSPENDS while loading. What must sit above it in the
//      tree to render a fallback during that wait? (There is none here.)
//   2. `React.lazy` expects the import to resolve to `{ default: Component }`.
//      Look at what `loadHeavy` actually resolves to (a NAMED key). React cannot
//      find the default export.
//
// EXPECTED CORRECT BEHAVIOR: a "Loading…" fallback shows briefly, then the heavy
//   component appears.
// =============================================================================

import { lazy, useState } from 'react';

function HeavyImpl() {
  return <p>🏋️ I am the heavy, code-split component.</p>;
}

// Simulates `() => import('./Heavy')` with an 800ms network delay.
// BUG #2: resolves `{ Heavy: ... }` — lazy needs `{ default: ... }`.
function loadHeavy() {
  return new Promise((resolve) => setTimeout(() => resolve({ Heavy: HeavyImpl }), 800));
}

const Heavy = lazy(() => loadHeavy() as Promise<{ default: React.ComponentType }>);

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Lazy loading</h1>
      <button onClick={() => setShow(true)}>Load heavy component</button>
      {/* BUG #1: <Heavy/> suspends while loading but there is no <Suspense>
          boundary above it to show a fallback. */}
      {show && <Heavy />}
    </main>
  );
}
