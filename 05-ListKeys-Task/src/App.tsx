// =============================================================================
// TASK 05 — Index-as-Key List Bugs
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// A packing list. Each row owns LOCAL state (its "packed?" checkbox) that lives
// inside the <Row> component, not in the parent array. Watch what happens to
// those checkboxes when the list changes shape.
//
// GOAL: Make per-row state stay attached to the right item. TWO distinct
//       key-related bugs.
//
// THINGS TO SCRUTINISE:
//   1. The list is keyed by ARRAY INDEX. Check "Tent" (the 3rd row), then click
//      "Remove first". Which row is now checked? Why did the checkmark stay on
//      index 2 instead of following the Tent?
//   2. The "recently added" sub-list renders with NO key at all — open the
//      console.
//
// EXPECTED CORRECT BEHAVIOR:
//   - A row's checkbox follows its ITEM across insert/remove/reorder.
//   - No "unique key" warning in the console.
//
// ACTUAL (buggy) BEHAVIOR: removing/reordering leaves the checkmark on the
//   wrong item, and the console warns about a missing key.
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
        {/* BUG #1: index as key — React matches rows (and their local state) by
            position, so removing/reordering leaves checkboxes on the wrong item. */}
        {items.map((item, index) => (
          <Row key={index} item={item} />
        ))}
      </ul>

      <h2>Just the names</h2>
      <ul>
        {/* BUG #2: no key at all — console warning, and React falls back to index. */}
        {items.map((item) => (
          <li>{item.name}</li>
        ))}
      </ul>
    </main>
  );
}
