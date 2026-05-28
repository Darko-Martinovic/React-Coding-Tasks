// =============================================================================
// SOLUTION 22 — Reset State via key
// =============================================================================
//
// Every change is annotated `// FIX #n`. Giving <UserEditor> a `key` tied to the
// user id makes React treat each user as a DISTINCT instance: switching users
// unmounts the old editor and mounts a fresh one, so ALL its internal state
// (draft AND dirty) re-initialises at once.
//
// Alternative: keep one instance and reset state in an effect on [user.id] — but
// `key` is simpler and avoids an extra render with stale values.
// =============================================================================

import { useState } from 'react';

type User = { id: number; name: string };
const USERS: User[] = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Linus' },
  { id: 3, name: 'Grace' },
];

function UserEditor({ user }: { user: User }) {
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
      {/* FIX #1 + #2: a per-user key remounts the editor, re-initialising every
          piece of its internal state for the newly selected user. */}
      <UserEditor key={user.id} user={user} />
    </main>
  );
}
