import { useState } from 'react'

export type Todo = {
  id: string
  text: string
  done: boolean
}

function newId() {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const add = () => {
    const text = input.trim()
    if (!text) return
    setTodos((prev) => [...prev, { id: newId(), text, done: false }])
    setInput('')
  }

  const toggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <section className="todo">
      <h2 className="todo__title">À faire</h2>
      <div className="todo__input-wrap">
        <input
          type="text"
          className="todo__input"
          placeholder="Nouvelle tâche..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button type="button" className="todo__add" onClick={add}>
          Ajouter
        </button>
      </div>
      <ul className="todo__list">
        {todos.map((t) => (
          <li
            key={t.id}
            className={`todo__item ${t.done ? 'todo__item--done' : ''}`}
          >
            <label className="todo__label">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="todo__check"
              />
              <span className="todo__text">{t.text}</span>
            </label>
            <button
              type="button"
              className="todo__remove"
              onClick={() => remove(t.id)}
              aria-label="Supprimer"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="todo__empty">Aucune tâche. Ajoutez-en une pour commencer.</p>
      )}
    </section>
  )
}
