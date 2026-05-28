// =============================================================================
// TASK 12 — Controlled vs Uncontrolled
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves + console warnings)
//
// A small form with three fields. Each is wired up incorrectly in a different
// classic way.
//
// GOAL: Fix all three fields. Open the console — React warns about one of them.
//
// THINGS TO SCRUTINISE:
//   1. `name` has a `value` but no `onChange`. Try typing — why is it frozen?
//      (React warns: a value prop without onChange makes a read-only field.)
//   2. `email` starts as `undefined`, so its input is uncontrolled until you
//      type, then becomes controlled (React warns: changing an uncontrolled
//      input to controlled).
//   3. The "subscribe" checkbox uses `defaultChecked` (initial value only)
//      instead of `checked`, so the "Force ON/OFF" buttons can't move it.
//
// EXPECTED CORRECT BEHAVIOR:
//   - Name and Email are editable and reflect their state.
//   - "Force ON/OFF" moves the checkbox; the checkbox always matches state.
//   - No console warnings.
//
// ACTUAL (buggy) BEHAVIOR: `name` won't type, the checkbox ignores the buttons,
//   and the console warns about controlled/uncontrolled inputs.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('Ada');
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [subscribe, setSubscribe] = useState(false);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Sign up</h1>
      <div>
        {/* BUG #1: value with no onChange → frozen, read-only field. */}
        <label>
          Name <input value={name} />
        </label>
      </div>
      <div>
        {/* BUG #2: value is `undefined` at first → uncontrolled → controlled flip. */}
        <label>
          Email <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div>
        {/* BUG #3: defaultChecked only seeds the initial value; later state
            changes (the buttons below) cannot move a defaultChecked checkbox. */}
        <label>
          <input type="checkbox" defaultChecked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} /> subscribe
        </label>{' '}
        <button onClick={() => setSubscribe(true)}>Force ON</button>{' '}
        <button onClick={() => setSubscribe(false)}>Force OFF</button>
      </div>
      <pre>{JSON.stringify({ name, email: email ?? null, subscribe }, null, 2)}</pre>
      {/* setName is intentionally unused above — wiring it into the Name field is FIX #1. */}
      <button onClick={() => setName('')}>clear name</button>
    </main>
  );
}
