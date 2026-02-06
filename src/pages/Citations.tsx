import { useState, useEffect } from 'react'

const STORAGE_FAV = 'myworld-quotes-fav'

const QUOTES = [
  { text: 'Le succès est la somme de petits efforts répétés jour après jour.', author: 'Robert Collier' },
  { text: 'La seule façon de faire du bon travail est d’aimer ce que vous faites.', author: 'Steve Jobs' },
  { text: 'Le futur appartient à ceux qui croient en la beauté de leurs rêves.', author: 'Eleanor Roosevelt' },
  { text: 'Chaque expert était autrefois un débutant.', author: 'Robin S. Sharma' },
  { text: 'L’action peut ne pas toujours apporter le bonheur, mais il n’y a pas de bonheur sans action.', author: 'William James' },
  { text: 'Ne remettez pas à demain ce que vous pouvez faire aujourd’hui.', author: 'Benjamin Franklin' },
  { text: 'La discipline est le pont entre les objectifs et la réalisation.', author: 'Jim Rohn' },
  { text: 'Croire en soi est le premier secret du succès.', author: 'Norman Vincent Peale' },
  { text: 'Le seul endroit où le succès précède le travail, c’est dans le dictionnaire.', author: 'Vidal Sassoon' },
  { text: 'Visez la lune. Même si vous la manquez, vous atterrirez parmi les étoiles.', author: 'Les Brown' },
  { text: 'La vie est 10 % ce qui nous arrive et 90 % comment nous y réagissons.', author: 'Charles R. Swindoll' },
  { text: 'Commencez là où vous êtes. Utilisez ce que vous avez. Faites ce que vous pouvez.', author: 'Arthur Ashe' },
  { text: 'Le courage n’est pas l’absence de peur, c’est agir malgré elle.', author: 'Mark Twain' },
  { text: 'Chaque jour est une nouvelle chance de changer votre vie.', author: 'Anonyme' },
  { text: 'La simplicité est la sophistication suprême.', author: 'Léonard de Vinci' },
]

function getQuoteOfDay() {
  const start = new Date(2025, 0, 1)
  const now = new Date()
  const day = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return QUOTES[day % QUOTES.length]
}

function loadFavorites(): typeof QUOTES {
  try {
    const raw = localStorage.getItem(STORAGE_FAV)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function Citations() {
  const [favorites, setFavorites] = useState<typeof QUOTES>(loadFavorites)
  const quoteOfDay = getQuoteOfDay()

  useEffect(() => {
    localStorage.setItem(STORAGE_FAV, JSON.stringify(favorites))
  }, [favorites])

  const isFav = (q: (typeof QUOTES)[0]) =>
    favorites.some((f) => f.text === q.text && f.author === q.author)

  const toggleFav = (q: (typeof QUOTES)[0]) => {
    if (isFav(q)) {
      setFavorites((prev) => prev.filter((f) => !(f.text === q.text && f.author === q.author)))
    } else {
      setFavorites((prev) => [...prev, q])
    }
  }

  const randomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
  const [random, setRandom] = useState(randomQuote)

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Citations</h1>
        <p className="page-header__subtitle">
          Une citation du jour pour vous inspirer. Sauvegardez vos préférées.
        </p>
      </header>
      <main className="quotes-page">
        <section className="quote-of-day">
          <h2 className="quote-of-day__label">Citation du jour</h2>
          <blockquote className="quote-of-day__block">
            <p className="quote-of-day__text">"{quoteOfDay.text}"</p>
            <cite className="quote-of-day__author">— {quoteOfDay.author}</cite>
          </blockquote>
          <button
            type="button"
            className={`quote-fav-btn ${isFav(quoteOfDay) ? 'active' : ''}`}
            onClick={() => toggleFav(quoteOfDay)}
          >
            {isFav(quoteOfDay) ? '♥ Favori' : '♡ Ajouter aux favoris'}
          </button>
        </section>
        <section className="quote-random">
          <h2 className="quote-random__label">Une autre citation</h2>
          <blockquote className="quote-random__block">
            <p className="quote-random__text">"{random.text}"</p>
            <cite className="quote-random__author">— {random.author}</cite>
          </blockquote>
          <div className="quote-random__actions">
            <button
              type="button"
              className={`quote-fav-btn ${isFav(random) ? 'active' : ''}`}
              onClick={() => toggleFav(random)}
            >
              {isFav(random) ? '♥ Favori' : '♡ Favori'}
            </button>
            <button
              type="button"
              className="quote-shuffle-btn"
              onClick={() => setRandom(randomQuote())}
            >
              Autre citation
            </button>
          </div>
        </section>
        <section className="quote-favorites">
          <h2 className="quote-favorites__label">Mes favoris</h2>
          {favorites.length === 0 ? (
            <p className="quote-favorites__empty">Aucune citation en favori.</p>
          ) : (
            <ul className="quote-favorites__list">
              {favorites.map((q, i) => (
                <li key={`${q.text}-${i}`} className="quote-fav-item">
                  <p>"{q.text}" — {q.author}</p>
                  <button
                    type="button"
                    className="quote-fav-remove"
                    onClick={() => toggleFav(q)}
                    aria-label="Retirer des favoris"
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
