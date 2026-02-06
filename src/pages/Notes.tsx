import { useState, useEffect } from 'react'

type Note = { id: string; title: string; content: string; updatedAt: string }

const STORAGE_KEY = 'myworld-notes'

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function newId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const selected = notes.find((n) => n.id === selectedId)
  const filtered = search.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      )
    : notes

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const addNote = () => {
    const note: Note = {
      id: newId(),
      title: 'Nouvelle note',
      content: '',
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => [note, ...prev])
    setSelectedId(note.id)
  }

  const updateNote = (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    )
  }

  const deleteNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    if (selectedId === id) setSelectedId(next[0]?.id ?? null)
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Notes</h1>
        <p className="page-header__subtitle">Bloc-notes personnel, sauvegardé localement.</p>
      </header>
      <main className="notes-page">
        <div className="notes-toolbar">
          <button type="button" className="notes-add-btn" onClick={addNote}>
            + Nouvelle note
          </button>
          <input
            type="text"
            className="notes-search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="notes-layout">
          <aside className="notes-sidebar">
            {filtered.length === 0 ? (
              <p className="notes-empty">Aucune note</p>
            ) : (
              <ul className="notes-list">
                {filtered.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`notes-list-item ${selectedId === n.id ? 'active' : ''}`}
                      onClick={() => setSelectedId(n.id)}
                    >
                      <span className="notes-list-item__title">{n.title || 'Sans titre'}</span>
                      <span className="notes-list-item__date">
                        {new Date(n.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
          <section className="notes-editor">
            {selected ? (
              <>
                <div className="notes-editor-header">
                  <input
                    type="text"
                    className="notes-editor-title"
                    value={selected.title}
                    onChange={(e) => updateNote(selected.id, { title: e.target.value })}
                    placeholder="Titre"
                  />
                  <button
                    type="button"
                    className="notes-delete-btn"
                    onClick={() => deleteNote(selected.id)}
                    aria-label="Supprimer"
                  >
                    Supprimer
                  </button>
                </div>
                <textarea
                  className="notes-editor-content"
                  value={selected.content}
                  onChange={(e) => updateNote(selected.id, { content: e.target.value })}
                  placeholder="Écrivez votre note..."
                  rows={16}
                />
              </>
            ) : (
              <div className="notes-editor-placeholder">
                Sélectionnez une note ou créez-en une nouvelle.
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
