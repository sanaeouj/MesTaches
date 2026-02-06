import { useState } from 'react'

type VisionCard = {
  id: string
  text: string
  color: string
}

const COLORS = [
  '#e85d3a',
  '#60a5fa',
  '#a78bfa',
  '#4ade80',
  '#fbbf24',
  '#f472b6',
]

function newId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function VisionBoard() {
  const [cards, setCards] = useState<VisionCard[]>([])
  const [newText, setNewText] = useState('')

  const addCard = () => {
    const text = newText.trim()
    if (!text) return
    setCards((prev) => [
      ...prev,
      { id: newId(), text, color: COLORS[prev.length % COLORS.length] },
    ])
    setNewText('')
  }

  const updateCard = (id: string, text: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, text } : c)))
  }

  const setCardColor = (id: string, color: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, color } : c)))
  }

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Vision Board</h1>
        <p className="page-header__subtitle">
          Ajoutez vos objectifs, rêves et idées pour les visualiser au quotidien.
        </p>
      </header>
      <main className="vision-page">
        <div className="vision-add">
          <input
            type="text"
            className="vision-add__input"
            placeholder="Un objectif, un rêve, une idée..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCard()}
          />
          <button type="button" className="vision-add__btn" onClick={addCard}>
            + Ajouter
          </button>
        </div>
        <div className="vision-board">
          {cards.map((card) => (
            <div
              key={card.id}
              className="vision-card"
              style={{ backgroundColor: card.color }}
            >
              <textarea
                className="vision-card__text"
                value={card.text}
                onChange={(e) => updateCard(card.id, e.target.value)}
                placeholder="Écrivez ici..."
                rows={3}
              />
              <div className="vision-card__footer">
                <div className="vision-card__colors">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`vision-card__color ${card.color === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCardColor(card.id, color)}
                      aria-label="Changer la couleur"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="vision-card__remove"
                  onClick={() => removeCard(card.id)}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        {cards.length === 0 && (
          <p className="vision-empty">
            Aucune carte. Ajoutez une idée ou un objectif pour commencer votre vision board.
          </p>
        )}
      </main>
    </>
  )
}
