// =============================================================================
// TASK 07 — Infinite Render Loop
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (CRASHES at runtime — open the console / error overlay)
//
// This dashboard is supposed to load a count once and flip its status to
// "ready" once. Instead React throws "Maximum update depth exceeded": it is
// stuck re-rendering forever.
//
// GOAL: Stop BOTH render loops. There are TWO independent effects that each spin
//       forever — fixing one still leaves the other, so find both.
//
// THINGS TO SCRUTINISE:
//   1. `options` is an object literal created during render. The first effect
//      depends on `[options]`. Is that dependency ever "the same" between
//      renders? (Object identity, not contents.)
//   2. The second effect sets the very state it depends on (`status`). What
//      does a `setState` that runs on every change to its own dependency do?
//
// EXPECTED CORRECT BEHAVIOR:
//   - count becomes 5 (options.limit) and stays there.
//   - status becomes "ready" and stays there.
//   - no re-render loop, no crash.
// =============================================================================

import { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('init');

  // BUG #1: a fresh object every render → `[options]` is never referentially
  //         equal → this effect runs after every commit → setCount → re-render…
  const options = { limit: 5 };
  useEffect(() => {
    setCount(options.limit);
  }, [options]);

  // BUG #2: this effect depends on `status` and also writes to `status`, so
  //         every run schedules another run — an unbounded self-feeding loop.
  useEffect(() => {
    setStatus(status + ' ✓');
  }, [status]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Dashboard</h1>
      <p>count: {count}</p>
      <p>status: {status}</p>
    </main>
  );
}
