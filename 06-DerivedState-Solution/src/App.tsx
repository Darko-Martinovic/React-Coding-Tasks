// =============================================================================
// SOLUTION 06 — Derived State in useState
// =============================================================================
//
// Every change is annotated `// FIX #n`. Derived values are now COMPUTED during
// render from the single source of truth — no extra state, no syncing effect,
// no staleness. (Wrap in useMemo only if the computation is genuinely heavy.)
// =============================================================================

import { useState } from 'react';

let nextId = 4;

export default function App() {
  const [first, setFirst] = useState('Ada');
  const [last, setLast] = useState('Lovelace');

  // FIX #1: derive during render. Always current, no effect, no stale deps.
  const fullName = `${first} ${last}`;

  const [items, setItems] = useState(['apple', 'apricot', 'banana']);
  const [query, setQuery] = useState('ap');

  // FIX #2: compute the filtered view during render from BOTH items and query,
  //         so adding an item or changing the query is reflected immediately.
  const visible = items.filter((i) => i.includes(query));

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Hello, {fullName}!</h1>
      <input value={first} onChange={(e) => setFirst(e.target.value)} />
      <input value={last} onChange={(e) => setLast(e.target.value)} />

      <h2>Fruit filter</h2>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="filter" />
      <button onClick={() => setItems((xs) => [...xs, `apricot-${nextId++}`])}>Add matching item</button>
      <ul>
        {visible.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </main>
  );
}
