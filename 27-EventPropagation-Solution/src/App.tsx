// =============================================================================
// SOLUTION 27 — Event Propagation & Outside Click
// =============================================================================
//
// Every change is annotated `// FIX #n`. The listener is attached only while the
// menu is open, fires on mousedown, ignores clicks INSIDE the menu (via a
// container ref + contains), and is removed on cleanup. Listening only while
// open also means the opening click is finished before the listener exists.
// =============================================================================

import { useEffect, useRef, useState } from 'react';

export default function App() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX #2: only listen while the menu is open.
    if (!open) return;

    function onDocMouseDown(e: MouseEvent) {
      // FIX #1: close only when the click is OUTSIDE the menu container.
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocMouseDown);
    // FIX #3: remove the listener on cleanup (and before re-running).
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Dropdown</h1>
      <div ref={menuRef} style={{ display: 'inline-block', position: 'relative' }}>
        <button onClick={() => setOpen((o) => !o)}>Menu {open ? '▲' : '▼'}</button>
        {open && (
          <ul style={{ border: '1px solid #ccc', padding: 8, listStyle: 'none', margin: 0 }}>
            <li><button>Profile</button></li>
            <li><button>Settings</button></li>
            <li><button>Sign out</button></li>
          </ul>
        )}
      </div>
      <p style={{ color: '#888' }}>open = {String(open)} — stays open until you click outside.</p>
    </main>
  );
}
