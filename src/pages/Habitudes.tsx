import { useState, useEffect } from 'react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const
const STORAGE_KEY = 'myworld-habits'

type Habit = { id: string; name: string; checks: string[] }

function getWeekKeys(): string[] {
  const keys: string[] = []
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1)
  for (let i = 0; i < 7; i++) {
    keys.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return keys
}

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function newId() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function Habitudes() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits)
  const [newName, setNewName] = useState('')
  const weekKeys = getWeekKeys()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    const name = newName.trim()
    if (!name) return
    setHabits((prev) => [...prev, { id: newId(), name, checks: [] }])
    setNewName('')
  }

  const toggleCheck = (habitId: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        const has = h.checks.includes(dateKey)
        return {
          ...h,
          checks: has
            ? h.checks.filter((c) => c !== dateKey)
            : [...h.checks, dateKey],
        }
      })
    )
  }

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Habitudes</h1>
        <p className="page-header__subtitle">
          Suivez vos habitudes semaine par semaine. Cochez chaque jour accompli.
        </p>
      </header>
      <main className="habits-page">
        <div className="habits-add">
          <input
            type="text"
            className="habits-add__input"
            placeholder="Nouvelle habitude (ex: Méditer 10 min)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <button type="button" className="habits-add__btn" onClick={addHabit}>
            + Ajouter
          </button>
        </div>
        <div className="habits-table-wrap">
          <table className="habits-table">
            <thead>
              <tr>
                <th className="habits-table__th habits-table__th--name">Habitude</th>
                {weekKeys.map((key, i) => (
                  <th key={key} className="habits-table__th habits-table__th--day">
                    {DAYS[i]}
                    <span className="habits-table__date">{new Date(key).getDate()}</span>
                  </th>
                ))}
                <th className="habits-table__th habits-table__th--action" />
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="habits-table__row">
                  <td className="habits-table__name">{habit.name}</td>
                  {weekKeys.map((key) => (
                    <td key={key} className="habits-table__cell">
                      <button
                        type="button"
                        className={`habits-check ${habit.checks.includes(key) ? 'checked' : ''}`}
                        onClick={() => toggleCheck(habit.id, key)}
                        aria-label={`${habit.name} ${key}`}
                      >
                        {habit.checks.includes(key) ? '✓' : ''}
                      </button>
                    </td>
                  ))}
                  <td className="habits-table__action">
                    <button
                      type="button"
                      className="habits-delete"
                      onClick={() => deleteHabit(habit.id)}
                      aria-label="Supprimer"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {habits.length === 0 && (
          <p className="habits-empty">Ajoutez une habitude pour commencer à la suivre.</p>
        )}
      </main>
    </>
  )
}
