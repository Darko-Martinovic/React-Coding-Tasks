// =============================================================================
// SOLUTION 03 — useEffect Dependencies
// =============================================================================
//
// Every change is annotated `// FIX #n`. Each effect now lists the reactive
// values it reads, so it re-runs exactly when those change.
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

  // FIX #1: depend on `selectedId` — the effect now re-runs (and re-reads the
  //         latest id) whenever the selection changes.
  useEffect(() => {
    let ignore = false;
    setProfile(null);
    fakeFetch(selectedId).then((p) => {
      if (!ignore) setProfile(p); // guard avoids a late response clobbering a newer one
    });
    return () => {
      ignore = true;
    };
  }, [selectedId]);

  // FIX #2: depend on `profile` — the title now follows the loaded profile.
  useEffect(() => {
    document.title = profile ? `Profile: ${profile.name}` : 'Loading…';
  }, [profile]);

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
        <p style={{ color: '#888' }}>Tab title tracks “Profile: {profile?.name}”.</p>
      </div>
    </main>
  );
}
