// =============================================================================
// TASK 26 — Subscription Cleanup
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// <Ticker> subscribes to a price feed. The feed exposes how many subscribers it
// currently has. Watch "feed subscribers" climb, and watch the price history
// refuse to grow past one entry.
//
// GOAL: Subscribe cleanly and accumulate history correctly. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. The effect calls `feed.subscribe(...)` but never uses the returned
//      unsubscribe. StrictMode subscribes twice, switching symbols subscribes
//      again, and nothing ever unsubscribes — subscribers only grow.
//   2. The handler does `setHistory([...history, p])`, closing over the
//      `history` from the render that created the subscription (always the
//      initial []). History never grows beyond one entry.
//
// EXPECTED CORRECT BEHAVIOR: exactly ONE subscriber per mount, and the history
//   list grows by one each tick.
// =============================================================================

import { useEffect, useState } from 'react';

// A tiny price feed that pushes a value to all subscribers every second.
const feed = (() => {
  const subs = new Map<number, (price: number) => void>();
  let seq = 0;
  setInterval(() => {
    const price = Math.round(50 + Math.random() * 50);
    subs.forEach((cb) => cb(price));
  }, 1000);
  return {
    subscribe(cb: (price: number) => void) {
      const id = ++seq;
      subs.set(id, cb);
      return () => subs.delete(id);
    },
    get subscriberCount() {
      return subs.size;
    },
  };
})();

function Ticker({ symbol }: { symbol: string }) {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    // BUG #1: the returned unsubscribe is ignored → subscribers accumulate.
    feed.subscribe((price) => {
      // BUG #2: stale `history` closure → always [].concat(price) → length 1.
      setHistory([...history, price]);
    });
  }, [symbol]);

  return (
    <section style={{ border: '1px solid #ccc', padding: 12, marginTop: 12 }}>
      <p>symbol: <strong>{symbol}</strong></p>
      <p>feed subscribers: <strong>{feed.subscriberCount}</strong></p>
      <p>history ({history.length}): [{history.join(', ')}]</p>
    </section>
  );
}

export default function App() {
  const [symbol, setSymbol] = useState('ACME');
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Price ticker</h1>
      <button onClick={() => setSymbol((s) => (s === 'ACME' ? 'GLOBEX' : 'ACME'))}>switch symbol</button>
      <Ticker symbol={symbol} />
    </main>
  );
}
