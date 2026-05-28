// =============================================================================
// SOLUTION 12 — Controlled vs Uncontrolled
// =============================================================================
//
// Every change is annotated `// FIX #n`. Each field is now fully controlled:
// a value/checked bound to state PLUS an onChange that writes it back.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('Ada');
  // FIX #2: initialise to '' (never undefined) so the input is controlled from
  //         the very first render — no uncontrolled→controlled warning.
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Sign up</h1>
      <div>
        <label>
          {/* FIX #1: add onChange so the field is editable and React-controlled. */}
          Name <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Email <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          {/* FIX #3: `checked` (not defaultChecked) binds the checkbox to state,
              so the buttons move it and it always matches `subscribe`. */}
          <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} /> subscribe
        </label>{' '}
        <button onClick={() => setSubscribe(true)}>Force ON</button>{' '}
        <button onClick={() => setSubscribe(false)}>Force OFF</button>
      </div>
      <pre>{JSON.stringify({ name, email, subscribe }, null, 2)}</pre>
      <button onClick={() => setName('')}>clear name</button>
    </main>
  );
}
