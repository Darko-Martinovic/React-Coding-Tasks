// =============================================================================
// SOLUTION 17 — forwardRef & useImperativeHandle
// =============================================================================
//
// Every change is annotated `// FIX #n`. The ref is forwarded from parent to
// child, the child attaches it to the real input, and the imperative methods go
// through React state instead of poking the DOM.
//
// React 19 note: forwardRef still works, but you can also accept `ref` as a
// normal prop now: `function TextField({ ref, ... }) { ... }`.
// =============================================================================

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

type TextFieldHandle = { focus: () => void; clear: () => void };

const TextField = forwardRef<TextFieldHandle, { placeholder?: string }>(function TextField(
  { placeholder },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    // FIX #3: clear through React state so the controlled value really updates.
    clear: () => setValue(''),
  }));

  // FIX #2: attach the ref so inputRef.current points at the DOM node.
  return (
    <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
  );
});

export default function App() {
  const ref = useRef<TextFieldHandle>(null);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Imperative handle</h1>
      {/* FIX #1: forward the ref to the child so ref.current is the handle. */}
      <TextField ref={ref} placeholder="type something" />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => ref.current?.focus()}>Focus</button>{' '}
        <button onClick={() => ref.current?.clear()}>Clear</button>
      </div>
    </main>
  );
}
