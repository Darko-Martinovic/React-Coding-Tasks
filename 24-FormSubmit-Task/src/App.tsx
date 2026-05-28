// =============================================================================
// TASK 24 — Form Submit & preventDefault
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (the page RELOADS — watch the URL and the list reset)
//
// Submitting this form should add a name to the list without leaving the page.
// Instead the browser does a full-page navigation (you'll see "?name=..." appear
// in the URL and the list reset). A helper button also submits the form by
// accident.
//
// GOAL: Keep the submit on the client. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. `handleSubmit` never calls `e.preventDefault()`. What does a <form>
//      do by default when submitted? (It navigates / reloads.)
//   2. The "Clear" button has no `type`. What is the DEFAULT type of a <button>
//      inside a <form>? (It is "submit" — so clicking it submits too.)
//
// EXPECTED CORRECT BEHAVIOR: "Add" appends the name and clears the box with NO
//   reload; "Clear" only clears the box and never submits.
// =============================================================================

import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [people, setPeople] = useState<string[]>(['Ada']);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // BUG #1: no e.preventDefault() → the browser performs the default form
    //         submission (a full navigation), reloading the app.
    if (name.trim()) setPeople((p) => [...p, name.trim()]);
    setName('');
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Guest list</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
        <button>Add</button>{' '}
        {/* BUG #2: no type → defaults to "submit", so this also submits the form. */}
        <button onClick={() => setName('')}>Clear</button>
      </form>
      <ul>
        {people.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <p style={{ color: '#888' }}>If the list resets to just “Ada”, the page reloaded.</p>
    </main>
  );
}
