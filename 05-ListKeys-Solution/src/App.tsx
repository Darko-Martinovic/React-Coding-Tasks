// =============================================================================
// SOLUTION 05 — Index-as-Key List Bugs
// =============================================================================
//
// Every change is annotated `// FIX #n`. Keys are now STABLE identities tied to
// the data, so React preserves each row's local state across list changes.
// =============================================================================

import { useState } from 'react';

type Item = { id: number; name: string };

function Row({ item }: { item: Item }) {
  const [packed, setPacked] = useState(false);
  return (
    <li>
      <label>
        <input type="checkbox" checked={packed} onChange={(e) => setPacked(e.target.checked)} /> {item.name}
        {packed ? ' ✅' : ''}
      </label>
    </li>
  );
}

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Map' },
    { id: 2, name: 'Compass' },
    { id: 3, name: 'Tent' },
    { id: 4, name: 'Stove' },
  ]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Packing list</h1>
      <button onClick={() => setItems((xs) => xs.slice(1))}>Remove first</button>
      <button onClick={() => setItems((xs) => [...xs].reverse())}>Reverse</button>
      <ul>
        {/* FIX #1: key by the item's stable id, so a row's local "packed" state
            travels WITH its item when the list is reordered or trimmed. */}
        {items.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </ul>

      <h2>Just the names</h2>
      <ul>
        {/* FIX #2: every list child needs a stable key — no more console warning. */}
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  );
}
