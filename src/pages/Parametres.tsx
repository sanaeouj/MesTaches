import { useState, useEffect } from 'react'

const THEME_KEY = 'myworld-theme'

export default function Parametres() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Paramètres</h1>
        <p className="page-header__subtitle">Personnalisez l’application.</p>
      </header>
      <main className="settings-page">
        <div className="settings-block">
          <h2 className="settings-block__title">Apparence</h2>
          <div className="settings-theme">
            <span className="settings-theme__label">Thème</span>
            <div className="settings-theme__options">
              <button
                type="button"
                className={`settings-theme__btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Sombre
              </button>
              <button
                type="button"
                className={`settings-theme__btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Clair
              </button>
            </div>
          </div>
        </div>
        <div className="settings-block">
          <h2 className="settings-block__title">À propos</h2>
          <p className="settings-about">
            MyWorld — Todo, Pomodoro, Budget, Vision Board, Notes, Habitudes, Objectifs, Citations.
            Toutes les données sont stockées localement dans votre navigateur.
          </p>
        </div>
      </main>
    </>
  )
}
