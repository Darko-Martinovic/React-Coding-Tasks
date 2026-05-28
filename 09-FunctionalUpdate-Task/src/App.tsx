// =============================================================================
// TASK 09 — Stale State & Batching
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// Two buttons that both read `count` from the render closure and write back a
// value computed from it. They under-count.
//
// GOAL: Make both buttons account for EVERY increment. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. "+3" calls setCount(count + 1) three times in one handler. React batches
//      these — what value of `count` does each call see? (They all see the same
//      snapshot.)
//   2. "Delayed +1" reads `count` now but applies it after a 1s timeout. If you
//      click a few times quickly, what `count` does each timeout remember?
//
// EXPECTED CORRECT BEHAVIOR:
//   - "+3" increases the count by exactly 3 per click.
//   - Mashing "Delayed +1" five times raises the count by 5 (after the delays).
//
// ACTUAL (buggy) BEHAVIOR: "+3" only adds 1, and rapid "Delayed +1" clicks all
//   land on the same stale value, so several clicks add only 1.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function addThree() {
    // BUG #1: all three reads see the SAME `count` from this render's closure,
    //         so the three updates collapse into "set to count + 1".
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function delayedAdd() {
    // BUG #2: `count` is captured now; by the time the timeout fires, newer
    //         clicks have advanced the real count, but this one still writes the
    //         old snapshot + 1.
    setTimeout(() => setCount(count + 1), 1000);
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Counter: {count}</h1>
      <button onClick={addThree}>+3</button>{' '}
      <button onClick={delayedAdd}>Delayed +1</button>
      <p style={{ color: '#888' }}>+3 should add 3; five quick “Delayed +1” clicks should add 5.</p>
    </main>
  );
}
