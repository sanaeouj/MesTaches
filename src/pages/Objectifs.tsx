import { useState, useEffect } from 'react'

const STORAGE_KEY = 'myworld-goals'

type Goal = {
  id: string
  title: string
  targetDate: string
  progress: number
  note: string
}

function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function newId() {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function Objectifs() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    targetDate: new Date().toISOString().slice(0, 10),
    note: '',
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    const title = form.title.trim()
    if (!title) return
    setGoals((prev) => [
      ...prev,
      { id: newId(), title, targetDate: form.targetDate, progress: 0, note: form.note },
    ])
    setForm({ title: '', targetDate: new Date().toISOString().slice(0, 10), note: '' })
    setShowForm(false)
  }

  const updateProgress = (id: string, progress: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, progress } : g)))
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const daysLeft = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    d.setHours(0, 0, 0, 0)
    return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Objectifs</h1>
        <p className="page-header__subtitle">
          Définissez vos objectifs, suivez votre progression et la date cible.
        </p>
      </header>
      <main className="goals-page">
        <button
          type="button"
          className="goals-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Nouvel objectif'}
        </button>
        {showForm && (
          <div className="goals-form">
            <input
              type="text"
              className="goals-form__input"
              placeholder="Titre de l'objectif"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              type="date"
              className="goals-form__date"
              value={form.targetDate}
              onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
            />
            <input
              type="text"
              className="goals-form__input"
              placeholder="Note (optionnel)"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
            <button type="button" className="goals-form__submit" onClick={addGoal}>
              Ajouter
            </button>
          </div>
        )}
        <div className="goals-list">
          {goals.map((g) => {
            const left = daysLeft(g.targetDate)
            return (
              <div key={g.id} className="goal-card">
                <div className="goal-card__header">
                  <h3 className="goal-card__title">{g.title}</h3>
                  <button
                    type="button"
                    className="goal-card__delete"
                    onClick={() => deleteGoal(g.id)}
                    aria-label="Supprimer"
                  >
                    ×
                  </button>
                </div>
                {g.note && <p className="goal-card__note">{g.note}</p>}
                <div className="goal-card__meta">
                  <span>Échéance : {new Date(g.targetDate).toLocaleDateString('fr-FR')}</span>
                  {left >= 0 && <span className="goal-card__days">{left} jour(s) restant(s)</span>}
                  {left < 0 && <span className="goal-card__days overdue">Échu</span>}
                </div>
                <div className="goal-card__progress">
                  <label className="goal-card__progress-label">
                    Progression : {g.progress}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={g.progress}
                    onChange={(e) => updateProgress(g.id, Number(e.target.value))}
                    className="goal-card__slider"
                  />
                </div>
              </div>
            )
          })}
        </div>
        {goals.length === 0 && !showForm && (
          <p className="goals-empty">Ajoutez un objectif pour commencer.</p>
        )}
      </main>
    </>
  )
}
