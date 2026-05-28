// =============================================================================
// SOLUTION 08 — Async Effect Race Condition
// =============================================================================
//
// Every change is annotated `// FIX #n`. The effect's cleanup flips an `ignore`
// flag so a superseded (or post-unmount) response can no longer write state.
// =============================================================================

import { useEffect, useState } from 'react';

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

    // FIX #1 + #2: a per-run `ignore` flag, flipped by cleanup, so the response
    //   from a previous query (or after unmount) is discarded. Cleanup runs
    //   before the next effect and on unmount — covering both defects.
    //   (A real fetch would also abort here via an AbortController.)
    let ignore = false;
    fakeSearch(query).then((r) => {
      if (ignore) return;
      setResults(r);
      setShownFor(query);
    });
    return () => {
      ignore = true;
    };
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
