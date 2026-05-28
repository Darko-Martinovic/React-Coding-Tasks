// =============================================================================
// TASK 03 — useEffect Dependencies
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// Pick a user from the list and their profile should load on the right, and the
// browser tab title should follow the loaded name. Both are wired through
// effects with the WRONG dependencies.
//
// GOAL: Fix the dependency arrays so the UI tracks the selection. There are
//       TWO distinct dependency bugs (in two separate effects).
//
// THINGS TO SCRUTINISE:
//   1. The fetch effect runs once with `[]`. What happens when `selectedId`
//      changes — does it re-run? What value does it even read?
//   2. The document.title effect also has `[]`. When does the title update?
//   3. "I'll just silence the lint warning" is not a fix — what is the array
//      actually FOR?
//
// EXPECTED CORRECT BEHAVIOR:
//   - Selecting a user loads THAT user's profile.
//   - The tab title becomes `Profile: <name>` for the loaded user.
//
// ACTUAL (buggy) BEHAVIOR: the profile and the title are stuck on Ada forever,
//   no matter who you click.
// =============================================================================

import { useEffect, useState } from 'react';

const DB: Record<number, { name: string; role: string }> = {
  1: { name: 'Ada', role: 'Engineer' },
  2: { name: 'Linus', role: 'Maintainer' },
  3: { name: 'Grace', role: 'Admiral' },
};

function fakeFetch(id: number): Promise<{ name: string; role: string }> {
  return new Promise((resolve) => setTimeout(() => resolve(DB[id]), 200));
}

export default function App() {
  const [selectedId, setSelectedId] = useState(1);
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null);

  // BUG #1: empty deps — this fetch runs once for the initial selectedId (1)
  //         and never again, so changing the selection does nothing.
  useEffect(() => {
    fakeFetch(selectedId).then(setProfile);
  }, []);

  // BUG #2: empty deps — the title is set once and never tracks `profile`.
  useEffect(() => {
    document.title = profile ? `Profile: ${profile.name}` : 'Loading…';
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24, display: 'flex', gap: 32 }}>
      <div>
        <h1>Users</h1>
        {Object.keys(DB).map((id) => (
          <div key={id}>
            <button onClick={() => setSelectedId(Number(id))}>{DB[Number(id)].name}</button>
          </div>
        ))}
      </div>
      <div>
        <h1>Profile (id {selectedId})</h1>
        {profile ? (
          <p>
            <strong>{profile.name}</strong> — {profile.role}
          </p>
        ) : (
          <p>Loading…</p>
        )}
        <p style={{ color: '#888' }}>Tab title should read “Profile: {profile?.name}”.</p>
      </div>
    </main>
  );
}
