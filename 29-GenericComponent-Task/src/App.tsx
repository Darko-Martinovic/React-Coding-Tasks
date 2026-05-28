// =============================================================================
// TASK 29 — Generic Components & Hooks
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: type-check (COMPILE-BY-DESIGN — making `tsc` pass IS the exercise)
//
// IMPORTANT: Vite does NOT type-check; `npm run dev` will appear to work. See
// the real errors with:
//
//     npm run typecheck      (i.e. tsc --noEmit)
//
// GOAL: Fix the types so `tsc --noEmit` reports ZERO errors, WITHOUT using `any`
//       or `!`. THREE distinct type bugs.
//
// THINGS TO SCRUTINISE:
//   1. `useState([])` infers `never[]`, so `setTags(['a','b'])` is rejected.
//      Annotate the state type.
//   2. <List> is not generic: `renderItem` is locked to `(item: number)`, but it
//      is rendered with string items. Make List generic over its item type.
//   3. `useRef<number>()` is called with no initial value. React 19's types
//      reject that (and without a value `current` would be `number | undefined`,
//      making `.toFixed()` unsafe). Give it an initial value.
// =============================================================================

import { useRef, useState, type ReactNode } from 'react';

// BUG #2: hard-coded `number` item type instead of being generic.
type ListProps = { items: string[]; renderItem: (item: number) => ReactNode };
function List({ items, renderItem }: ListProps) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>{renderItem(it)}</li>
      ))}
    </ul>
  );
}

export default function App() {
  // BUG #1: inferred as never[].
  const [tags, setTags] = useState([]);

  // BUG #3: called with no initial value (React 19 types reject this; current
  //         would also be possibly-undefined).
  const renderCount = useRef<number>();
  renderCount.current = (renderCount.current ?? 0) + 1;

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Generics</h1>
      {/* BUG #1: string[] is not assignable to never[]. */}
      <button onClick={() => setTags(['react', 'typescript'])}>load tags</button>
      {/* BUG #3: 'current' is possibly 'undefined'. */}
      <p>render #{renderCount.current.toFixed(0)}</p>
      <List items={tags} renderItem={(t) => <strong>{t}</strong>} />
    </main>
  );
}
