// =============================================================================
// TASK 20 — StrictMode Double-Invoke
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// In development, React StrictMode intentionally mounts components twice
// (mount → unmount → mount) to surface effects that are not safe to run more
// than once. These effects are NOT, so the bugs are visible immediately.
//
// GOAL: Make both effects resilient to being run twice. TWO distinct bugs — the
//       fix is NOT a "did I already run?" ref guard, it is proper CLEANUP.
//
// THINGS TO SCRUTINISE:
//   1. The chat effect opens a connection but returns no cleanup. StrictMode
//      leaves TWO open connections; switching rooms leaks even more. What should
//      the effect return so each "connect" is paired with a "disconnect"?
//   2. The second effect appends "opened" to a shared history with no way to
//      undo it, so the entry appears twice. How can cleanup reverse the setup?
//
// EXPECTED CORRECT BEHAVIOR: exactly ONE active connection at a time, and the
//   history shows "opened" exactly once. Switching rooms never leaks.
// =============================================================================

import { useEffect, useState } from 'react';

// --- module-level "real world" so leaks are visible ---------------------------
const activeConnections: string[] = [];
const history: string[] = [];
let connSeq = 0;

function createConnection(roomId: string) {
  const id = ++connSeq;
  const label = `${roomId}#${id}`;
  return {
    connect() {
      activeConnections.push(label);
    },
    disconnect() {
      const i = activeConnections.indexOf(label);
      if (i >= 0) activeConnections.splice(i, 1);
    },
  };
}

function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const conn = createConnection(roomId);
    conn.connect();
    // BUG #1: no cleanup — the connection is never closed.
  }, [roomId]);

  useEffect(() => {
    history.push('opened');
    // BUG #2: nothing reverses this push, so StrictMode records it twice.
  }, []);

  return (
    <section style={{ border: '1px solid #ccc', padding: 12, marginTop: 12 }}>
      <p>Room: <strong>{roomId}</strong></p>
      <p>active connections: <strong>{activeConnections.length}</strong> [{activeConnections.join(', ')}]</p>
      <p>history: [{history.join(', ')}]</p>
    </section>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [, forceReadout] = useState(0);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Chat</h1>
      <button onClick={() => setRoomId((r) => (r === 'general' ? 'random' : 'general'))}>
        switch room
      </button>{' '}
      <button onClick={() => forceReadout((n) => n + 1)}>refresh readout</button>
      <ChatRoom roomId={roomId} />
      <p style={{ color: '#888' }}>Expect 1 connection and one “opened” — not 2.</p>
    </main>
  );
}
