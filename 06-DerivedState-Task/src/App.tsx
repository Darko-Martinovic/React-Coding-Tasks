// =============================================================================
// TASK 06 — Derived State in useState
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// Two values here are DERIVED from other state but are mistakenly stored in
// their own useState and "kept in sync" with effects. They drift out of date.
//
// GOAL: Stop storing derived data. TWO distinct pieces of derived state to
//       remove.
//
// THINGS TO SCRUTINISE:
//   1. `fullName` is stored separately and synced from first/last via an effect.
//      Type in the name fields and read the greeting — it lags one keystroke
//      behind (the effect runs AFTER render with the old value).
//   2. `visible` (the filtered list) is stored and synced only when `query`
//      changes. Add a new item that matches the query — does it appear?
//
// EXPECTED CORRECT BEHAVIOR:
//   - The greeting always matches the current first + last name.
//   - The filtered list reflects BOTH the query and the latest items.
//
// ACTUAL (buggy) BEHAVIOR: the greeting trails by one keystroke, and newly
//   added matching items never show up in the filtered list.
// =============================================================================

import { useEffect, useState } from 'react';

let nextId = 4;

export default function App() {
  const [first, setFirst] = useState('Ada');
  const [last, setLast] = useState('Lovelace');

  // BUG #1: derived value parked in state…
  const [fullName, setFullName] = useState(`${first} ${last}`);
  // …and synced via an effect that runs after the render with stale inputs.
  useEffect(() => {
    setFullName(`${first} ${last}`);
  }, [first]); // also: missing `last` in deps

  const [items, setItems] = useState(['apple', 'apricot', 'banana']);
  const [query, setQuery] = useState('ap');

  // BUG #2: filtered list parked in state, only recomputed when `query` changes,
  //         so adding a matching item does not update it.
  const [visible, setVisible] = useState<string[]>(items.filter((i) => i.includes(query)));
  useEffect(() => {
    setVisible(items.filter((i) => i.includes(query)));
  }, [query]);

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
