// =============================================================================
// SOLUTION 07 — Infinite Render Loop
// =============================================================================
//
// Every change is annotated `// FIX #n`. Each effect now has a STABLE dependency
// and does not feed itself, so both run once and stop. (Both effects are also
// idempotent, so React StrictMode's double-invoke in dev is harmless.)
// =============================================================================

import { useEffect, useMemo, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('init');

  // FIX #1: give `options` a stable identity. useMemo with [] deps keeps the
  //         same object across renders (hoisting it as a module constant works
  //         too). Now the effect runs once. Even simpler: depend on the
  //         primitive `[options.limit]`.
  const options = useMemo(() => ({ limit: 5 }), []);
  useEffect(() => {
    setCount(options.limit);
  }, [options]);

  // FIX #2: run once on mount ([] deps) and set an absolute value rather than
  //         deriving from — and depending on — the state being written.
  useEffect(() => {
    setStatus('ready');
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Dashboard</h1>
      <p>count: {count}</p>
      <p>status: {status}</p>
    </main>
  );
}
