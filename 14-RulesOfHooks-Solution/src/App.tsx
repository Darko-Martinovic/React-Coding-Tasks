// =============================================================================
// SOLUTION 14 — Conditional Hooks (Rules of Hooks)
// =============================================================================
//
// Every change is annotated `// FIX #n`. All hooks are now called
// unconditionally at the top level, in the same order on every render. The
// CONDITIONS move into the returned JSX, not around the hook calls.
// =============================================================================

import { useEffect, useState } from 'react';

function Profile({ userId, showBio }: { userId: number | null; showBio: boolean }) {
  // FIX #1 + #2: every hook runs every render, before any early return and
  //              outside any condition. Hook order is now stable.
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [bio] = useState('Enjoys long walks through stack traces.');

  useEffect(() => {
    if (userId !== null) document.title = `User ${userId}`;
  }, [userId]);

  // The early return now comes AFTER all hooks have been called.
  if (userId === null) {
    return <p>No user selected.</p>;
  }

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
