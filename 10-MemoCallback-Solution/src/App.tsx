// =============================================================================
// SOLUTION 10 — useMemo / useCallback Misuse
// =============================================================================
//
// Every change is annotated `// FIX #n`. The dependency arrays now list every
// reactive value the hook reads, so the memo recomputes and the callback stays
// current. (For a multiply this cheap, useMemo is optional — the lesson is that
// IF you memoize, the deps must be correct.)
// =============================================================================

import { useCallback, useMemo, useRef, useState } from 'react';

const PRICE = 10;

export default function App() {
  const [qty, setQty] = useState(2);
  const memoRuns = useRef(0);

  // FIX #1: depend on `qty` so the total recomputes when it changes.
  const total = useMemo(() => {
    memoRuns.current++;
    return qty * PRICE;
  }, [qty]);

  // FIX #2: depend on `total` so the callback always sees the current value.
  const logTotal = useCallback(() => {
    console.log('total is', total);
    alert(`total is ${total}`);
  }, [total]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Cart line</h1>
      <p>
        qty: {qty} × ${PRICE} = <strong>${total}</strong>
      </p>
      <button onClick={() => setQty((q) => q + 1)}>+ qty</button>{' '}
      <button onClick={() => setQty((q) => Math.max(1, q - 1))}>- qty</button>{' '}
      <button onClick={logTotal}>Log total</button>
      <p style={{ color: '#888' }}>memo ran {memoRuns.current} time(s) — re-runs as qty changes.</p>
    </main>
  );
}
