// =============================================================================
// TASK 27 — Event Propagation & Outside Click
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// Clicking "Menu" should open the dropdown and keep it open until you click
// OUTSIDE it. Instead the menu refuses to open at all (it opens and instantly
// closes within the same click), and clicking an item also closes it.
//
// GOAL: Make the dropdown open and close correctly. THREE distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. The document listener closes the menu on ANY click — including the very
//      click that opened it (which bubbles up to document) and clicks INSIDE the
//      menu. What check (and which container ref) limits it to OUTSIDE clicks?
//   2. The listener is attached once on mount regardless of `open`. Should it
//      only be listening while the menu is open?
//   3. The effect returns no cleanup, so the listener is never removed.
//
// EXPECTED CORRECT BEHAVIOR: "Menu" opens the list; clicking an item or inside
//   keeps it open; clicking anywhere outside closes it.
// =============================================================================

import { useEffect, useState } from 'react';

export default function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // BUG #1: closes on EVERY click (no "is it outside?" check, no container ref).
    // BUG #2: attached unconditionally instead of only while open.
    function onDocClick() {
      setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    // BUG #3: no cleanup — the listener is never removed.
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Dropdown</h1>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <button onClick={() => setOpen((o) => !o)}>Menu {open ? '▲' : '▼'}</button>
        {open && (
          <ul style={{ border: '1px solid #ccc', padding: 8, listStyle: 'none', margin: 0 }}>
            <li><button>Profile</button></li>
            <li><button>Settings</button></li>
            <li><button>Sign out</button></li>
          </ul>
        )}
      </div>
      <p style={{ color: '#888' }}>open = {String(open)} — it should stay open until you click outside.</p>
    </main>
  );
}
