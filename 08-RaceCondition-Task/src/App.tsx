// =============================================================================
// TASK 08 — Async Effect Race Condition
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// A search box fetches results in an effect on every change to `query`. The
// fake API is SLOWER for shorter queries (see `fakeSearch`), so as you type, an
// earlier request finishes AFTER a later one and overwrites the fresh results
// with stale ones.
//
// GOAL: Make the UI always show results for the LATEST query. There are TWO
//       related defects, both fixed by the same small mechanism.
//
// THINGS TO SCRUTINISE:
//   1. When the effect re-runs for a new query, what stops the previous request
//      (still in flight) from calling setState when it eventually resolves?
//   2. The effect returns no cleanup. What happens if a response arrives after
//      the component has moved on (or unmounted)?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Type "react"; the panel ends on results for "react".
//   - "Showing results for" always equals the text in the box.
//
// ACTUAL (buggy) BEHAVIOR: after typing quickly, the results settle on an
//   EARLIER query (e.g. "r" or "re") — a slow response landed last.
// =============================================================================

import { useEffect, useState } from 'react';

// Shorter queries resolve slower → guarantees out-of-order responses.
function fakeSearch(query: string): Promise<string[]> {
  const delay = query.length === 0 ? 0 : Math.max(50, 700 - query.length * 150);
  return new Promise((resolve) =>
    setTimeout(() => resolve([`${query} result A`, `${query} result B`]), delay),
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [shownFor, setShownFor] = useState('');

  useEffect(() => {
    if (!query) {
      setResults([]);
      setShownFor('');
      return;
    }
    // BUG: nothing cancels or ignores this request when `query` changes again.
    fakeSearch(query).then((r) => {
      setResults(r);
      setShownFor(query);
    });
  }, [query]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Search</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="type fast…" />
      <p>
        Showing results for: <strong>{shownFor || '—'}</strong>{' '}
        {shownFor && shownFor !== query ? <span style={{ color: 'crimson' }}>(stale!)</span> : null}
      </p>
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </main>
  );
}
