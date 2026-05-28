// =============================================================================
// TASK 01 — Stale Closure in setInterval
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// A "ticker" should increment `count` by `step` once per second. The user can
// change `step` with the +/- buttons. It is broken in several distinct ways.
//
// GOAL: Fix ALL the bugs so the ticker behaves as described below. There are
//       THREE separate problems hiding in one tiny effect.
//
// THINGS TO SCRUTINISE:
//   1. What value of `count` does the interval callback actually see on each
//      tick? (It was created once — what did it close over?)
//   2. When you change `step`, does the running interval ever notice?
//   3. What happens to the interval when this component unmounts — or when
//      React StrictMode mounts it twice in development? Count the timers.
//
// EXPECTED CORRECT BEHAVIOR:
//   - count increases by `step` every second (1, 2, 3, ... with step=1).
//   - Changing `step` to 5 makes the very next tick add 5.
//   - Exactly ONE interval is ever running; it is cleared on unmount.
//
// ACTUAL (buggy) BEHAVIOR: the counter jumps to `1` and then sticks there
//   forever, and changing `step` does nothing. (Open the console.)
// =============================================================================

import { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log('[interval] created');
    // BUG: closes over the initial `count` (0) and initial `step` (1), forever.
    //      No cleanup, so the timer survives unmount and StrictMode runs two.
    setInterval(() => {
      setCount(count + step);
    }, 1000);
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Ticker</h1>
      <p style={{ fontSize: 48, margin: '8px 0' }}>{count}</p>
      <p>
        step = <strong>{step}</strong>{' '}
        <button onClick={() => setStep((s) => s + 1)}>+ step</button>{' '}
        <button onClick={() => setStep((s) => Math.max(1, s - 1))}>- step</button>
      </p>
      <p style={{ color: '#888' }}>Expected: count should climb by `step` every second.</p>
    </main>
  );
}
