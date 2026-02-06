import { Link } from 'react-router-dom'

const cards = [
  { to: '/focus', label: 'Todo & Pomodoro', desc: 'Tâches et timer de concentration', emoji: '🍅' },
  { to: '/budget', label: 'Budget', desc: 'Suivi des dépenses en DH', emoji: '💰' },
  { to: '/vision-board', label: 'Vision Board', desc: 'Objectifs et rêves à visualiser', emoji: '🎯' },
  { to: '/notes', label: 'Notes', desc: 'Bloc-notes personnel', emoji: '📝' },
  { to: '/habitudes', label: 'Habitudes', desc: 'Suivi hebdomadaire', emoji: '✅' },
  { to: '/objectifs', label: 'Objectifs', desc: 'Goals et progression', emoji: '🏁' },
  { to: '/citations', label: 'Citations', desc: 'Inspiration au quotidien', emoji: '💬' },
]

export default function Dashboard() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Tableau de bord</h1>
        <p className="page-header__subtitle">
          Accédez rapidement à toutes les sections de MyWorld.
        </p>
      </header>
      <main className="dashboard-page">
        <div className="dashboard-grid">
          {cards.map(({ to, label, desc, emoji }) => (
            <Link key={to} to={to} className="dashboard-card">
              <span className="dashboard-card__emoji">{emoji}</span>
              <h2 className="dashboard-card__title">{label}</h2>
              <p className="dashboard-card__desc">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
