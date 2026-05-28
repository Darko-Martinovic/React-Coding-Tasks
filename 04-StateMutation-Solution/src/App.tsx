// =============================================================================
// SOLUTION 04 — Direct State Mutation
// =============================================================================
//
// Every change is annotated `// FIX #n`. Each updater returns a brand-new array
// (and new objects where the contents change), so React sees a changed
// reference and re-renders.
// =============================================================================

import { useState } from 'react';

type Todo = { id: number; text: string; done: boolean };
let nextId = 4;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Write tests', done: false },
    { id: 2, text: 'Review PR', done: true },
    { id: 3, text: 'Ship it', done: false },
  ]);
  const [draft, setDraft] = useState('');

  function add() {
    if (!draft.trim()) return;
    // FIX #1: build a NEW array with the new item (functional updater is safe
    //         against batching too).
    setTodos((prev) => [...prev, { id: nextId++, text: draft, done: false }]);
    setDraft('');
  }

  function toggle(id: number) {
    // FIX #2: map to a new array, replacing only the toggled todo with a NEW
    //         object — never mutate the existing one.
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function sortByText() {
    // FIX #3: copy first ([...prev]) so sort does not mutate state in place.
    setTodos((prev) => [...prev].sort((a, b) => a.text.localeCompare(b.text)));
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Todos</h1>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="New todo" />
      <button onClick={add}>Add</button>
      <button onClick={sortByText}>Sort A→Z</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id} onClick={() => toggle(t.id)} style={{ textDecoration: t.done ? 'line-through' : 'none', cursor: 'pointer' }}>
            {t.text}
          </li>
        ))}
      </ul>
      <p style={{ color: '#888' }}>Add / toggle / sort all update immediately.</p>
    </main>
  );
}
