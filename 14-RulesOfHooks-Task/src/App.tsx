// =============================================================================
// TASK 14 — Conditional Hooks (Rules of Hooks)
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (renders, then CRASHES on interaction — check the console)
//
// <Profile> looks fine on first paint. Then click the buttons and React throws
// "Rendered more/fewer hooks than during the previous render", because hooks
// are called conditionally — so their call order changes between renders.
//
// GOAL: Obey the Rules of Hooks. TWO distinct violations.
//
// THINGS TO SCRUTINISE:
//   1. There is an early `return` when `userId` is null, but `useState`/
//      `useEffect` are called AFTER it. Toggle the user off → fewer hooks run.
//   2. A `useState` is called INSIDE `if (showBio)`. Toggle bio on → an extra
//      hook appears. Hooks must run unconditionally, in the same order, every
//      render.
//
// EXPECTED CORRECT BEHAVIOR: toggling the user and the bio never crashes; the
//   UI updates normally.
// =============================================================================

import { useEffect, useState } from 'react';

function Profile({ userId, showBio }: { userId: number | null; showBio: boolean }) {
  const [expanded, setExpanded] = useState(false);

  // BUG #1: early return sits ABOVE the hooks below — so when userId is null,
  //         fewer hooks run than on the previous render.
  if (userId === null) {
    return <p>No user selected.</p>;
  }

  const [note, setNote] = useState('');

  // BUG #2: a hook called conditionally — only when showBio is true.
  let bio = '';
  if (showBio) {
    const [bioState] = useState('Enjoys long walks through stack traces.');
    bio = bioState;
  }

  useEffect(() => {
    document.title = `User ${userId}`;
  }, [userId]);

  return (
    <section>
      <h2>User #{userId}</h2>
      <button onClick={() => setExpanded((e) => !e)}>{expanded ? 'Collapse' : 'Expand'}</button>
      {expanded && <p>Some details…</p>}
      {showBio && <p>Bio: {bio}</p>}
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="note" />
    </section>
  );
}

export default function App() {
  const [userId, setUserId] = useState<number | null>(1);
  const [showBio, setShowBio] = useState(false);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Profile</h1>
      <button onClick={() => setUserId((u) => (u === null ? 1 : null))}>toggle user</button>{' '}
      <button onClick={() => setShowBio((b) => !b)}>toggle bio</button>
      <Profile userId={userId} showBio={showBio} />
    </main>
  );
}
