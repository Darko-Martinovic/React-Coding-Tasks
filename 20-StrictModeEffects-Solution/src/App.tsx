// =============================================================================
// SOLUTION 20 — StrictMode Double-Invoke
// =============================================================================
//
// Every change is annotated `// FIX #n`. Each effect now returns a cleanup that
// reverses its setup. That makes the effects idempotent under StrictMode's
// double-invoke AND correct when dependencies change or the component unmounts.
// (A `didInit` ref guard would silence StrictMode but still leak in production.)
// =============================================================================

import { useEffect, useState } from 'react';

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
    // FIX #1: disconnect on cleanup — every connect is paired with a disconnect,
    //         so there is exactly one live connection at a time.
    return () => conn.disconnect();
  }, [roomId]);

  useEffect(() => {
    history.push('opened');
    // FIX #2: cleanup reverses the push, so a double mount nets a single entry.
    return () => {
      const i = history.lastIndexOf('opened');
      if (i >= 0) history.splice(i, 1);
    };
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
      <p style={{ color: '#888' }}>One connection, one “opened” — even after switching rooms.</p>
    </main>
  );
}
