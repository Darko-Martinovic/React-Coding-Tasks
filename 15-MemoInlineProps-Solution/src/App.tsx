// =============================================================================
// SOLUTION 15 — React.memo & Inline Props
// =============================================================================
//
// Every change is annotated `// FIX #n`. The props now keep a stable identity
// between renders, so memo's shallow compare can skip re-rendering <Row> when
// nothing it depends on changed.
// =============================================================================

import { memo, useCallback, useRef, useState } from 'react';

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

// FIX #1/#2: truly-static values are hoisted to module scope — one identity for
//            the life of the program. (useMemo with [] deps would work too.)
const ROW_STYLE: React.CSSProperties = { padding: 8, border: '1px solid #ccc', marginTop: 8 };
const ROW_TAGS = ['react', 'memo'];

export default function App() {
  const [tick, setTick] = useState(0);
  const [label, setLabel] = useState('Alpha');

  // FIX #3: useCallback keeps the same function identity until `label` changes.
  const onSelect = useCallback(() => console.log('selected', label), [label]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>memo & props</h1>
      <button onClick={() => setTick((t) => t + 1)}>tick ({tick})</button>{' '}
      <button onClick={() => setLabel((l) => (l === 'Alpha' ? 'Beta' : 'Alpha'))}>change label</button>
      <Row label={label} style={ROW_STYLE} tags={ROW_TAGS} onSelect={onSelect} />
    </main>
  );
}
