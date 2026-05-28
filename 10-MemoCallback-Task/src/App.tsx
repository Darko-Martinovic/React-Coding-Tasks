// =============================================================================
// TASK 10 — useMemo / useCallback Misuse
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// A cart line: total = qty × price, plus a "Log total" button. Both the memo
// and the callback have EMPTY dependency arrays, so they freeze on the first
// render's values.
//
// GOAL: Give each hook the right dependencies. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. `total` is a useMemo with `[]` deps. Change qty — does total recompute?
//      (Watch "memo ran N times": it never increases.)
//   2. `logTotal` is a useCallback with `[]` deps. It closes over qty/total from
//      the first render. What does it print after you change qty?
//
// EXPECTED CORRECT BEHAVIOR:
//   - total updates whenever qty changes.
//   - "Log total" prints the CURRENT total.
//
// ACTUAL (buggy) BEHAVIOR: total is stuck at the initial 2 × 10 = 20, and the
//   button always logs 20 no matter the qty.
// =============================================================================

import { useCallback, useMemo, useRef, useState } from 'react';

const PRICE = 10;

export default function App() {
  const [qty, setQty] = useState(2);
  const memoRuns = useRef(0);

  // BUG #1: empty deps → the memo computes once and never reacts to `qty`.
  const total = useMemo(() => {
    memoRuns.current++;
    return qty * PRICE;
  }, []);

  // BUG #2: empty deps → this callback captures the first-render `total` forever.
  const logTotal = useCallback(() => {
    console.log('total is', total);
    alert(`total is ${total}`);
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Cart line</h1>
      <p>
        qty: {qty} × ${PRICE} = <strong>${total}</strong>
      </p>
      <button onClick={() => setQty((q) => q + 1)}>+ qty</button>{' '}
      <button onClick={() => setQty((q) => Math.max(1, q - 1))}>- qty</button>{' '}
      <button onClick={logTotal}>Log total</button>
      <p style={{ color: '#888' }}>memo ran {memoRuns.current} time(s) — it should re-run when qty changes.</p>
    </main>
  );
}
