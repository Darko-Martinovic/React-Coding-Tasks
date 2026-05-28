// =============================================================================
// SOLUTION 23 — Falsy Conditional Render
// =============================================================================
//
// Every change is annotated `// FIX #n`. Guard with a real BOOLEAN (or a ternary
// returning null) so the left operand can never be a renderable 0 / NaN.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);
  const cartCount = items.length;

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>
        Cart {/* FIX #1: compare to make the left side a boolean */}
        {cartCount > 0 && <span style={{ color: 'crimson' }}>({cartCount})</span>}
      </h1>

      <button onClick={() => setItems((xs) => [...xs, `item ${xs.length + 1}`])}>add item</button>{' '}
      <button onClick={() => setItems([])}>empty cart</button>{' '}
      <button onClick={() => setUnread((u) => (u === 0 ? 3 : 0))}>toggle unread</button>

      {/* FIX #2: `length > 0` (or a ternary `: null`) instead of a bare length */}
      {items.length > 0 && (
        <ul>
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}

      {/* FIX #3: ternary returning null — never renders the number 0 */}
      <p>notifications: {unread > 0 ? '🔔' : null}</p>
    </main>
  );
}
