import { Link } from 'react-router-dom'

export default function Accueil() {
  return (
    <main className="accueil-page">
      <div className="accueil-hero">
        <h1 className="accueil-hero__title">MyWorld</h1>
        <p className="accueil-hero__tagline">
          Votre espace pour organiser tâches, budget, objectifs et inspiration.
        </p>
        <p className="accueil-hero__desc">
          Todo & Pomodoro, Budget en dirham, Vision Board, Notes, Habitudes, Objectifs et Citations — tout au même endroit.
        </p>
        <Link to="/dashboard" className="accueil-hero__cta">
          Accéder au tableau de bord
        </Link>
      </div>
      <div className="accueil-quick">
        <p className="accueil-quick__label">Accès rapide</p>
        <div className="accueil-quick__links">
          <Link to="/focus" className="accueil-quick__link">Todo & Pomodoro</Link>
          <Link to="/dashboard" className="accueil-quick__link">Tableau de bord</Link>
          <Link to="/budget" className="accueil-quick__link">Budget</Link>
        </div>
      </div>
    </main>
  )
}
