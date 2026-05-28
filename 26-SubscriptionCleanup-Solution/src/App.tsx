// =============================================================================
// SOLUTION 26 — Subscription Cleanup
// =============================================================================
//
// Every change is annotated `// FIX #n`. The effect returns the unsubscribe
// (so there is one subscriber per mount and switching symbols replaces it), and
// the handler uses the functional updater so it never reads a stale `history`.
// =============================================================================

import { useEffect, useState } from 'react';

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
    // FIX #2: functional updater always appends to the latest history.
    const unsubscribe = feed.subscribe((price) => {
      setHistory((prev) => [...prev, price]);
    });
    // FIX #1: tear the subscription down on unmount and before re-subscribing
    //         for a new symbol. (Wrapped so the cleanup returns void — the
    //         unsubscribe itself returns a boolean.)
    return () => {
      unsubscribe();
    };
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
