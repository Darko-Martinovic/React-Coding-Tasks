// =============================================================================
// SOLUTION 01 — Stale Closure in setInterval
// =============================================================================
//
// Every change is annotated `// FIX #n`. The interval must (a) read the latest
// count, (b) react to a changed step, and (c) be torn down exactly once.
// =============================================================================

import { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log('[interval] created');
    const id = setInterval(() => {
      // FIX #1: Use the functional updater so each tick adds to the LATEST
      //         count instead of the stale `count` captured at mount (which was
      //         always 0, so the counter froze at 1).
      setCount((c) => c + step);
    }, 1000);

    // FIX #3: Always clear the interval on cleanup. This stops the leak on
    //         unmount AND makes StrictMode's mount→unmount→mount cycle leave
    //         exactly one timer running (the duplicate is cleared).
    return () => {
      console.log('[interval] cleared');
      clearInterval(id);
    };
    // FIX #2: `step` is a dependency. When it changes we tear down the old timer
    //         and start one that adds the new step. (Alternative: keep [] deps
    //         and read step from a ref to avoid resetting the 1s phase.)
  }, [step]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Ticker</h1>
      <p style={{ fontSize: 48, margin: '8px 0' }}>{count}</p>
      <p>
        step = <strong>{step}</strong>{' '}
        <button onClick={() => setStep((s) => s + 1)}>+ step</button>{' '}
        <button onClick={() => setStep((s) => Math.max(1, s - 1))}>- step</button>
      </p>
      <p style={{ color: '#888' }}>count climbs by `step` every second; one timer only.</p>
    </main>
  );
}
