// =============================================================================
// TASK 23 — Falsy Conditional Render
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (renders stray values — no type error)
//
// With an empty cart, the UI shows literal "0" characters where nothing should
// appear. This is the classic `number && <JSX/>` trap: `&&` returns its LEFT
// operand when that operand is falsy, and React renders the numbers 0 / NaN
// (but not false/null/undefined).
//
// GOAL: Render nothing when there is nothing to show. THREE distinct leaks.
//
// THINGS TO SCRUTINISE:
//   1. `{cartCount && <span>…}` — when cartCount is 0, what does `&&` evaluate
//      to, and does React render it?
//   2. `{items.length && <ul>…}` — same trap with an array length of 0.
//   3. `{unread && '🔔'}` — a 0 leaks through here too.
//
// EXPECTED CORRECT BEHAVIOR: with an empty cart and no unread items, NO stray
//   "0" appears anywhere. Adding an item shows the badge and list.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);
  const cartCount = items.length;

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>
        Cart {/* BUG #1: renders "0" when empty */}
        {cartCount && <span style={{ color: 'crimson' }}>({cartCount})</span>}
      </h1>

      <button onClick={() => setItems((xs) => [...xs, `item ${xs.length + 1}`])}>add item</button>{' '}
      <button onClick={() => setItems([])}>empty cart</button>{' '}
      <button onClick={() => setUnread((u) => (u === 0 ? 3 : 0))}>toggle unread</button>

      {/* BUG #2: renders "0" when the list is empty */}
      {items.length && (
        <ul>
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}

      {/* BUG #3: renders "0" when unread is 0 */}
      <p>notifications: {unread && '🔔'}</p>
    </main>
  );
}
