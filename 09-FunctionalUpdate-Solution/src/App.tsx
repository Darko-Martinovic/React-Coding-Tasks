// =============================================================================
// SOLUTION 09 — Stale State & Batching
// =============================================================================
//
// Every change is annotated `// FIX #n`. Both handlers use the functional
// updater form, so each update is applied to the LATEST state, not a snapshot.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function addThree() {
    // FIX #1: updater form — each call receives the result of the previous one,
    //         so three calls reliably add three.
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  function delayedAdd() {
    // FIX #2: updater form reads the current value at apply time, so overlapping
    //         delayed clicks each add one regardless of when they fire.
    setTimeout(() => setCount((c) => c + 1), 1000);
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Counter: {count}</h1>
      <button onClick={addThree}>+3</button>{' '}
      <button onClick={delayedAdd}>Delayed +1</button>
      <p style={{ color: '#888' }}>+3 adds 3; five quick “Delayed +1” clicks add 5.</p>
    </main>
  );
}
