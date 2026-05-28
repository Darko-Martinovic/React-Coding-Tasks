// =============================================================================
// TASK 15 — React.memo & Inline Props
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// <Row> is wrapped in React.memo so it should only re-render when its props
// actually change. But clicking the unrelated "tick" button re-renders it every
// single time (watch its render counter). memo is being defeated by props whose
// IDENTITY changes on every parent render.
//
// GOAL: Let memo do its job. THREE distinct prop identities are recreated each
//       render.
//
// THINGS TO SCRUTINISE:
//   1. `style={{ ... }}` — a new object literal every render.
//   2. `tags={[ ... ]}` — a new array literal every render.
//   3. `onSelect={() => ...}` — a new function every render.
//   memo does a shallow compare; all three are "different" each time.
//
// EXPECTED CORRECT BEHAVIOR: clicking "tick" does NOT re-render <Row> (its
//   counter stays put). Only changing the label should re-render it.
// =============================================================================

import { memo, useRef, useState } from 'react';

type RowProps = { label: string; style: React.CSSProperties; tags: string[]; onSelect: () => void };

const Row = memo(function Row({ label, style, tags, onSelect }: RowProps) {
  const renders = useRef(0);
  renders.current++;
  return (
    <div style={style} onClick={onSelect}>
      <strong>{label}</strong> — tags: {tags.join(', ')} · Row rendered {renders.current} time(s)
    </div>
  );
});

export default function App() {
  const [tick, setTick] = useState(0);
  const [label, setLabel] = useState('Alpha');

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>memo & props</h1>
      <button onClick={() => setTick((t) => t + 1)}>tick ({tick})</button>{' '}
      <button onClick={() => setLabel((l) => (l === 'Alpha' ? 'Beta' : 'Alpha'))}>change label</button>
      {/* BUG #1/#2/#3: object, array and function literals are recreated on every
          render, so memo's shallow compare always sees "changed" props. */}
      <Row
        label={label}
        style={{ padding: 8, border: '1px solid #ccc', marginTop: 8 }}
        tags={['react', 'memo']}
        onSelect={() => console.log('selected', label)}
      />
    </main>
  );
}
