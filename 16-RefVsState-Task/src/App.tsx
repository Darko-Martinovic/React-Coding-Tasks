// =============================================================================
// TASK 16 — Ref vs State
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// Two widgets pick the WRONG tool. The rule of thumb: if a value should appear
// on screen, it belongs in state; if it is a mutable handle to something (like a
// DOM node) that should NOT trigger re-render, it belongs in a ref.
//
// GOAL: Swap ref↔state in each widget. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. <Likes> keeps the count in a useRef. Clicking mutates ref.current, but
//      the displayed number never changes. Why does mutating a ref not re-render?
//   2. <AutoFocus> stores the input element in useState and tries to focus it in
//      a mount effect. The effect runs with the FIRST render's value (null), so
//      focus never happens. What tool gives you a stable handle without that
//      timing problem?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Clicking 👍 increments the visible count.
//   - The text input is focused automatically on load.
// =============================================================================

import { useEffect, useRef, useState } from 'react';

function Likes() {
  // BUG #1: a value that must render is kept in a ref → UI never updates.
  const likes = useRef(0);
  return (
    <button onClick={() => { likes.current++; }}>
      👍 {likes.current}
    </button>
  );
}

function AutoFocus() {
  // BUG #2: storing the DOM node in state. The mount effect below closes over
  //         the first render's value (null), so it never focuses.
  const [node, setNode] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    node?.focus();
  }, []);

  return <input ref={setNode} placeholder="should auto-focus on load" />;
}

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Ref vs State</h1>
      <p><Likes /></p>
      <p><AutoFocus /></p>
    </main>
  );
}
