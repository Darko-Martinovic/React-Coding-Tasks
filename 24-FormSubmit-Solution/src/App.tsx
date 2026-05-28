// =============================================================================
// SOLUTION 24 — Form Submit & preventDefault
// =============================================================================
//
// Every change is annotated `// FIX #n`. The submit handler cancels the default
// navigation, and non-submitting buttons declare type="button".
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [people, setPeople] = useState<string[]>(['Ada']);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // FIX #1: cancel the browser's default full-page form submission.
    e.preventDefault();
    if (name.trim()) setPeople((p) => [...p, name.trim()]);
    setName('');
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Guest list</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
        {/* The submit button is explicit for clarity. */}
        <button type="submit">Add</button>{' '}
        {/* FIX #2: type="button" so Clear does NOT submit the form. */}
        <button type="button" onClick={() => setName('')}>
          Clear
        </button>
      </form>
      <ul>
        {people.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <p style={{ color: '#888' }}>Add appends and clears; Clear only clears. No reload.</p>
    </main>
  );
}
