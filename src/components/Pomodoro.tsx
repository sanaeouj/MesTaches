import { useState, useEffect, useCallback } from 'react'

const DEFAULT_WORK = 25
const DEFAULT_SHORT = 5
const DEFAULT_LONG = 15

const MIN_MINUTES = 1
const MAX_MINUTES = 90

type Phase = 'work' | 'shortBreak' | 'longBreak'

const phaseLabels: Record<Phase, string> = {
  work: 'Concentration',
  shortBreak: 'Courte pause',
  longBreak: 'Longue pause',
}

export type HistoryEntry = {
  id: string
  phase: Phase
  durationMinutes: number
  completedAt: Date
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function formatHistoryTime(d: Date) {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatHistoryDate(d: Date) {
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem('pomodoro-history')
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryEntry[]
    return parsed.map((e) => ({
      ...e,
      completedAt: new Date(e.completedAt),
    }))
  } catch {
    return []
  }
}

function saveHistory(history: HistoryEntry[]) {
  try {
    localStorage.setItem('pomodoro-history', JSON.stringify(history))
  } catch {
    // ignore
  }
}

export default function Pomodoro() {
  const [workMin, setWorkMin] = useState(DEFAULT_WORK)
  const [shortMin, setShortMin] = useState(DEFAULT_SHORT)
  const [longMin, setLongMin] = useState(DEFAULT_LONG)
  const [phase, setPhase] = useState<Phase>('work')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)

  const getDurationSec = useCallback(
    (p: Phase) => {
      if (p === 'work') return workMin * 60
      if (p === 'shortBreak') return shortMin * 60
      return longMin * 60
    },
    [workMin, shortMin, longMin]
  )

  const resetPhase = useCallback(
    (p: Phase) => {
      setPhase(p)
      setTimeLeft(getDurationSec(p))
      setIsRunning(false)
    },
    [getDurationSec]
  )

  const clamp = (v: number) => Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, v))

  useEffect(() => {
    if (!isRunning || timeLeft !== 0) return
    const completedPhase = phase
    const durationMinutes = completedPhase === 'work' ? workMin : completedPhase === 'shortBreak' ? shortMin : longMin
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      phase: completedPhase,
      durationMinutes,
      completedAt: new Date(),
    }
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 100)
      saveHistory(next)
      return next
    })
    if (completedPhase === 'work') {
      setPhase('shortBreak')
      setTimeLeft(shortMin * 60)
    } else if (completedPhase === 'shortBreak') {
      setPhase('work')
      setTimeLeft(workMin * 60)
    } else {
      setPhase('work')
      setTimeLeft(workMin * 60)
    }
  }, [timeLeft, isRunning, phase, workMin, shortMin, longMin])

  useEffect(() => {
    if (!isRunning) setTimeLeft(getDurationSec(phase))
  }, [phase, workMin, shortMin, longMin, isRunning, getDurationSec])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000)
    return () => clearInterval(t)
  }, [isRunning, timeLeft])

  const clearHistory = () => {
    setHistory([])
    saveHistory([])
  }

  return (
    <section className="pomodoro">
      <h2 className="pomodoro__section-title">Réglages des durées (minutes)</h2>
      <div className="pomodoro__settings">
        <label className="pomodoro__setting">
          <span className="pomodoro__setting-label">Concentration</span>
          <input
            type="number"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={workMin}
            onChange={(e) => setWorkMin(clamp(Number(e.target.value) || workMin))}
            className="pomodoro__input"
            disabled={isRunning}
          />
        </label>
        <label className="pomodoro__setting">
          <span className="pomodoro__setting-label">Courte pause</span>
          <input
            type="number"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={shortMin}
            onChange={(e) => setShortMin(clamp(Number(e.target.value) || shortMin))}
            className="pomodoro__input"
            disabled={isRunning}
          />
        </label>
        <label className="pomodoro__setting">
          <span className="pomodoro__setting-label">Longue pause</span>
          <input
            type="number"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={longMin}
            onChange={(e) => setLongMin(clamp(Number(e.target.value) || longMin))}
            className="pomodoro__input"
            disabled={isRunning}
          />
        </label>
      </div>

      <div className={`pomodoro__ring pomodoro__ring--${phase}`}>
        <div className="pomodoro__display">
          <span className="pomodoro__phase">{phaseLabels[phase]}</span>
          <span className="pomodoro__time">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="pomodoro__controls">
        <button
          type="button"
          className="pomodoro__btn"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Démarrer'}
        </button>
        <button
          type="button"
          className="pomodoro__btn pomodoro__btn--secondary"
          onClick={() => resetPhase(phase)}
        >
          Réinitialiser
        </button>
      </div>
      <div className="pomodoro__phases">
        {(['work', 'shortBreak', 'longBreak'] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`pomodoro__phase-btn ${phase === p ? 'active' : ''}`}
            onClick={() => resetPhase(p)}
          >
            {phaseLabels[p]}
          </button>
        ))}
      </div>

      <div className="pomodoro__history">
        <div className="pomodoro__history-header">
          <h3 className="pomodoro__history-title">Historique</h3>
          {history.length > 0 && (
            <button
              type="button"
              className="pomodoro__history-clear"
              onClick={clearHistory}
            >
              Effacer
            </button>
          )}
        </div>
        <ul className="pomodoro__history-list">
          {history.map((e) => (
            <li key={e.id} className={`pomodoro__history-item pomodoro__history-item--${e.phase}`}>
              <span className="pomodoro__history-duration">{e.durationMinutes} min</span>
              <span className="pomodoro__history-phase">{phaseLabels[e.phase]}</span>
              <span className="pomodoro__history-date">{formatHistoryDate(e.completedAt)}</span>
              <span className="pomodoro__history-time">{formatHistoryTime(e.completedAt)}</span>
            </li>
          ))}
        </ul>
        {history.length === 0 && (
          <p className="pomodoro__history-empty">Aucune session enregistrée.</p>
        )}
      </div>
    </section>
  )
}
