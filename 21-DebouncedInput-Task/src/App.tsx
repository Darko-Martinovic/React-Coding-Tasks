// =============================================================================
// TASK 21 — Debounced Input Stale Value
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// Typing in the box should "commit" the search 500ms AFTER you stop typing
// (debounce), firing once. Instead it fires on (almost) every keystroke and
// commits a value that is one character behind.
//
// GOAL: Make it debounce correctly and commit the CURRENT text. TWO distinct
//       bugs.
//
// THINGS TO SCRUTINISE:
//   1. `timer` is a plain local variable. It is re-created on every render, so
//      `clearTimeout(timer)` on the next keystroke clears... what, exactly?
//      (The previous timeout is never actually cancelled.)
//   2. The timeout callback reads `text` — the state value from when the handler
//      ran, i.e. BEFORE this keystroke was applied. It commits a stale value.
//
// EXPECTED CORRECT BEHAVIOR: "times fired" increases by 1 per typing pause, and
//   "committed" equals exactly what is in the box.
// =============================================================================

import { useRef, useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [committed, setCommitted] = useState('');
  const fired = useRef(0);

  // BUG #1: a fresh `timer` binding every render → clearTimeout never cancels
  //         the pending timeout from the previous keystroke.
  let timer: ReturnType<typeof setTimeout> | undefined;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      fired.current++;
      // BUG #2: commits `text` (stale: the value before this keystroke).
      setCommitted(text);
    }, 500);
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Debounced search</h1>
      <input value={text} onChange={onChange} placeholder="type a query…" />
      <p>committed: <strong>{committed || '—'}</strong></p>
      <p>times fired: <strong>{fired.current}</strong></p>
    </main>
  );
}
