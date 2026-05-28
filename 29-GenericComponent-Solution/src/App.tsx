// =============================================================================
// SOLUTION 29 — Generic Components & Hooks
// =============================================================================
//
// Every change is annotated `// FIX #n`. `tsc --noEmit` now passes. State and
// ref hooks are given explicit type arguments / initial values, and <List> is
// generic over its item type so it infers from `items`.
// =============================================================================

import { useRef, useState, type ReactNode } from 'react';

// FIX #2: make List generic — the item type flows from `items` to `renderItem`.
type ListProps<T> = { items: T[]; renderItem: (item: T) => ReactNode };
function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>{renderItem(it)}</li>
      ))}
    </ul>
  );
}

export default function App() {
  // FIX #1: annotate the element type so the array is string[], not never[].
  const [tags, setTags] = useState<string[]>([]);

  // FIX #3: provide an initial value so `current` is always a number.
  const renderCount = useRef<number>(0);
  renderCount.current = renderCount.current + 1;

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Generics</h1>
      <button onClick={() => setTags(['react', 'typescript'])}>load tags</button>
      <p>render #{renderCount.current.toFixed(0)}</p>
      {/* List infers T = string from `items`, so `t` is a string here. */}
      <List items={tags} renderItem={(t) => <strong>{t}</strong>} />
    </main>
  );
}
