// =============================================================================
// TASK 22 — Reset State via key
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// <UserEditor> seeds its internal draft from the `user` prop. Edit one user,
// then pick a DIFFERENT user from the list: the editor still shows the previous
// user's edits, and the "unsaved changes" flag is wrong too.
//
// GOAL: Reset the editor's internal state when the selected user changes. TWO
//       stale pieces of state, fixable with ONE idea.
//
// THINGS TO SCRUTINISE:
//   1. `useState(user.name)` only uses its argument on the FIRST mount. When the
//      `user` prop changes, the component does not remount, so `draft` keeps the
//      old value.
//   2. The same is true for the `dirty` flag — it never resets for the new user.
//   3. How can you tell React "this is a DIFFERENT component instance now, throw
//      away its state and start fresh"?  (Hint: a special prop.)
//
// EXPECTED CORRECT BEHAVIOR: selecting a user shows THAT user's name in the box,
//   with "unsaved changes" reset to false.
// =============================================================================

import { useState } from 'react';

type User = { id: number; name: string };
const USERS: User[] = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Linus' },
  { id: 3, name: 'Grace' },
];

function UserEditor({ user }: { user: User }) {
  // BUG #1 + #2: both pieces of state initialise from props once and never reset
  //              when `user` changes, because the instance is reused.
  const [draft, setDraft] = useState(user.name);
  const [dirty, setDirty] = useState(false);

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, marginTop: 12 }}>
      <p>Editing user #{user.id} (prop name: {user.name})</p>
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setDirty(true);
        }}
      />
      <p>unsaved changes: {dirty ? 'yes' : 'no'}</p>
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(1);
  const user = USERS.find((u) => u.id === selectedId)!;

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>User editor</h1>
      {USERS.map((u) => (
        <button key={u.id} onClick={() => setSelectedId(u.id)}>
          {u.name}
        </button>
      ))}
      <UserEditor user={user} />
    </main>
  );
}
