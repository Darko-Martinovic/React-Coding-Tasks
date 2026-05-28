// =============================================================================
// SOLUTION 16 — Ref vs State
// =============================================================================
//
// Every change is annotated `// FIX #n`. The on-screen counter moves to state
// (so changes re-render); the DOM handle moves to a ref (stable, no re-render,
// and available synchronously when the mount effect runs).
// =============================================================================

import { useEffect, useRef, useState } from 'react';

function Likes() {
  // FIX #1: a rendered value belongs in state. Use the functional updater so
  //         rapid clicks are not lost.
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes((n) => n + 1)}>👍 {likes}</button>;
}

function AutoFocus() {
  // FIX #2: a ref gives a stable handle. React assigns ref.current during commit
  //         (before effects run), so the mount effect can focus it reliably and
  //         updating it never triggers a re-render.
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="should auto-focus on load" />;
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
