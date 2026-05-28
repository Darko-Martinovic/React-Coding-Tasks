// =============================================================================
// SOLUTION 21 — Debounced Input Stale Value
// =============================================================================
//
// Every change is annotated `// FIX #n`. The idiomatic React debounce is an
// effect keyed on the value, with a cleanup that cancels the pending timer.
// Because the effect re-runs for each new `text`, the timeout always commits the
// CURRENT value, and only the last (uncancelled) timer fires.
// =============================================================================

import { useEffect, useRef, useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [committed, setCommitted] = useState('');
  const fired = useRef(0);

  // FIX #1 + #2: debounce via an effect. The cleanup cancels the previous timer
  //              (so only a real pause fires it), and `text` is read fresh from
  //              this render's scope — never stale.
  useEffect(() => {
    const id = setTimeout(() => {
      fired.current++;
      setCommitted(text);
    }, 500);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Debounced search</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type a query…" />
      <p>committed: <strong>{committed || '—'}</strong></p>
      <p>times fired: <strong>{fired.current}</strong></p>
    </main>
  );
}
