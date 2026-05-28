// =============================================================================
// TASK 02 — Effect Cleanup Leak
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and leaks — no type error)
//
// <Widget/> subscribes to window "resize" and starts a 1-second clock. Toggle
// the checkbox to mount/unmount it and watch the LIVE counters at the top:
// they track how many timers and resize-listeners are currently alive.
//
// GOAL: Make the widget clean up after itself. There are THREE distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. The effect adds a resize listener and an interval — where does it remove
//      / clear them? (What does an effect return to clean up?)
//   2. Even if you *call* removeEventListener, will it remove the right
//      function? Look at the handler reference passed to add vs (the missing)
//      remove.
//   3. Toggle the widget off/on a few times, and note StrictMode mounts it
//      twice on load. What should the LIVE counters read? (Hint: 1 and 1.)
//
// EXPECTED CORRECT BEHAVIOR:
//   - With the widget shown, liveTimers === 1 and liveListeners === 1.
//   - Hiding the widget drops both back to 0.
//   - Toggling repeatedly never makes the numbers climb.
//
// ACTUAL (buggy) BEHAVIOR: the counters start at 2 (StrictMode) and climb by 2
//   every time you toggle the widget back on — nothing is ever released.
// =============================================================================

import { useEffect, useState } from 'react';

// Module-level "instrumentation" so the leak is visible on screen.
let liveTimers = 0;
let liveListeners = 0;

function Widget() {
  const [width, setWidth] = useState(window.innerWidth);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // BUG: handler is an inline arrow — there is no stable reference to remove.
    window.addEventListener('resize', () => setWidth(window.innerWidth));
    liveListeners++;

    setInterval(() => setSeconds((s) => s + 1), 1000);
    liveTimers++;

    // BUG: no cleanup function returned — listener and interval both leak.
  }, []);

  return (
    <section style={{ border: '1px solid #ccc', padding: 16, marginTop: 12 }}>
      <p>window width: {width}px</p>
      <p>alive for: {seconds}s</p>
    </section>
  );
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Cleanup Leak</h1>
      <p>
        liveTimers = <strong>{liveTimers}</strong> &nbsp; liveListeners ={' '}
        <strong>{liveListeners}</strong>
      </p>
      <label>
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> show widget
      </label>
      {show && <Widget />}
      <p style={{ color: '#888' }}>Toggle the checkbox and watch the counters climb (they should not).</p>
    </main>
  );
}
