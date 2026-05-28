// =============================================================================
// SOLUTION 02 — Effect Cleanup Leak
// =============================================================================
//
// Every change is annotated `// FIX #n`. The effect now returns a cleanup that
// removes the SAME handler reference and clears the interval, so the live
// counters never climb past 1.
// =============================================================================

import { useEffect, useState } from 'react';

let liveTimers = 0;
let liveListeners = 0;

function Widget() {
  const [width, setWidth] = useState(window.innerWidth);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // FIX #2: A stable, named handler so add and remove refer to the SAME
    //         function. An inline arrow passed to removeEventListener would be a
    //         different object and silently remove nothing.
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    liveListeners++;

    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    liveTimers++;

    // FIX #1 + #3: Return a cleanup that releases BOTH resources. React runs it
    //              on unmount and before re-running the effect — which is also
    //              what makes StrictMode's mount→unmount→mount settle at 1/1.
    return () => {
      window.removeEventListener('resize', onResize);
      liveListeners--;
      clearInterval(id);
      liveTimers--;
    };
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
      <p style={{ color: '#888' }}>Toggle all you like — the counters stay at 1 (shown) / 0 (hidden).</p>
    </main>
  );
}
