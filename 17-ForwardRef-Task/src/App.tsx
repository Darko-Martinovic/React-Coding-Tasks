// =============================================================================
// TASK 17 — forwardRef & useImperativeHandle
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs, then CRASHES when you click "Focus")
//
// The parent wants to drive <TextField> imperatively via "Focus" and "Clear"
// buttons. THREE things in the wiring are wrong, end to end.
//
// GOAL: Make Focus and Clear work. THREE distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. The parent creates `ref` but never passes it to <TextField>. What is
//      `ref.current` when a button handler runs?
//   2. Inside <TextField>, `inputRef` is created but never attached to the
//      <input>. So `inputRef.current.focus()` dereferences null.
//   3. `clear()` sets `inputRef.current.value = ''` directly on the DOM node.
//      The input is CONTROLLED by React state — poking the DOM does not update
//      that state, so it does not really clear.
//
// EXPECTED CORRECT BEHAVIOR: "Focus" focuses the field; "Clear" empties it and
//   it stays empty.
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
    // BUG #2: inputRef is never attached below, so current is null here.
    focus: () => inputRef.current!.focus(),
    // BUG #3: mutating the DOM value of a controlled input — React state is
    //         unchanged, so it does not really clear / it snaps back.
    clear: () => {
      inputRef.current!.value = '';
    },
  }));

  // BUG #2 (cont.): the ref={inputRef} attribute is missing here.
  return <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />;
});

export default function App() {
  const ref = useRef<TextFieldHandle>(null);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Imperative handle</h1>
      {/* BUG #1: ref is never forwarded to the child, so ref.current stays null. */}
      <TextField placeholder="type something" />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => ref.current!.focus()}>Focus</button>{' '}
        <button onClick={() => ref.current!.clear()}>Clear</button>
      </div>
    </main>
  );
}
