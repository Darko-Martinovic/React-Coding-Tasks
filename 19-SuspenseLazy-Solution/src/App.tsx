// =============================================================================
// SOLUTION 19 — Suspense & lazy
// =============================================================================
//
// Every change is annotated `// FIX #n`. The import resolves to a `default`
// export, and the lazy component renders inside a <Suspense> boundary that
// provides the fallback while it loads.
// =============================================================================

import { lazy, Suspense, useState } from 'react';

function HeavyImpl() {
  return <p>🏋️ I am the heavy, code-split component.</p>;
}

// FIX #2: resolve to `{ default: Component }`, exactly what lazy expects. (A real
//         `import('./Heavy')` does this automatically for `export default`; for a
//         named export you map it: `.then(m => ({ default: m.Heavy }))`.)
function loadHeavy(): Promise<{ default: React.ComponentType }> {
  return new Promise((resolve) => setTimeout(() => resolve({ default: HeavyImpl }), 800));
}

const Heavy = lazy(loadHeavy);

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Lazy loading</h1>
      <button onClick={() => setShow(true)}>Load heavy component</button>
      {/* FIX #1: a Suspense boundary renders the fallback while Heavy loads. */}
      <Suspense fallback={<p>Loading…</p>}>{show && <Heavy />}</Suspense>
    </main>
  );
}
