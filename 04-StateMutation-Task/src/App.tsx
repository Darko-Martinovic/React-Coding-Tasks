// =============================================================================
// TASK 04 — Direct State Mutation
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// A tiny todo list. Adding, toggling, and sorting all "work" in memory but the
// screen does not update, because the state is mutated in place.
//
// GOAL: Make every update produce NEW state so React re-renders. There are
//       THREE distinct mutations to fix.
//
// THINGS TO SCRUTINISE:
//   1. `add` pushes onto the existing array, then passes the SAME array
//      reference to the setter. Did the reference change?
//   2. `toggle` flips a boolean on an existing object — same object, same
//      array. Will React notice?
//   3. `sort` reorders the array in place (Array.prototype.sort mutates).
//
// EXPECTED CORRECT BEHAVIOR:
//   - Adding appends a visible row.
//   - Toggling strikes the row through immediately.
//   - Sort reorders the visible list.
//
// ACTUAL (buggy) BEHAVIOR: clicking the buttons changes nothing on screen
//   (the data mutates underneath, but no re-render happens).
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
    // BUG #1: push mutates the array, and we hand the SAME reference back.
    todos.push({ id: nextId++, text: draft, done: false });
    setTodos(todos);
    setDraft('');
  }

  function toggle(id: number) {
    // BUG #2: mutating the existing todo object in the existing array.
    const t = todos.find((t) => t.id === id);
    if (t) t.done = !t.done;
    setTodos(todos);
  }

  function sortByText() {
    // BUG #3: sort() sorts in place and returns the same array reference.
    setTodos(todos.sort((a, b) => a.text.localeCompare(b.text)));
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
      <p style={{ color: '#888' }}>Click a row to toggle. Nothing updates — why?</p>
    </main>
  );
}
